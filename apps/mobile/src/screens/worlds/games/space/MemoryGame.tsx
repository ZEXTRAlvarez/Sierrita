import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { speak } from '../../../../../../../libs/audio/src/audioManager';
import type { GameProps } from '../../GameScreen';

const CARD_EMOJIS = [
  '🚀', '🌟', '💫', '🪐', '☄️', '🛸', '🌠', '👾',
  '🔭', '🌌', '💥', '🪨', '🌙', '⭐', '🌞', '🛰️',
];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(pairs: number): Card[] {
  const emojis = [...CARD_EMOJIS].sort(() => Math.random() - 0.5).slice(0, pairs);
  const cards: Card[] = [];
  let id = 0;
  for (const emoji of emojis) {
    cards.push({ id: id++, emoji, flipped: false, matched: false });
    cards.push({ id: id++, emoji, flipped: false, matched: false });
  }
  return cards.sort(() => Math.random() - 0.5);
}

export default function MemoryGame({
  params,
  onRoundComplete,
  onGameFinish,
}: GameProps) {
  const pairs     = (params.pairs as number) || 4;
  const flipDelay = (params.flipDelay as number) || 1200;

  const [cards, setCards]           = useState<Card[]>(() => buildDeck(pairs));
  const [flipped, setFlipped]       = useState<number[]>([]);
  const [matched, setMatched]       = useState<number>(0);
  const [locked, setLocked]         = useState(false);
  const [finished, setFinished]     = useState(false);
  const scaleAnims                  = useRef<Animated.Value[]>([]).current;

  // Init scale animations
  useEffect(() => {
    while (scaleAnims.length < pairs * 2) {
      scaleAnims.push(new Animated.Value(1));
    }
    speak('¡Encontrá los pares! Tocá las cartas');
  }, []);

  const handleCardPress = useCallback((cardIdx: number) => {
    if (locked || finished) return;
    const card = cards[cardIdx];
    if (card.flipped || card.matched) return;
    if (flipped.length >= 2) return;

    // Flip animation
    Animated.spring(scaleAnims[cardIdx] ?? new Animated.Value(1), {
      toValue: 1.08,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnims[cardIdx] ?? new Animated.Value(1), {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    });

    const newCards = cards.map((c, i) =>
      i === cardIdx ? { ...c, flipped: true } : c,
    );
    const newFlipped = [...flipped, cardIdx];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      const [a, b] = newFlipped;
      const match = newCards[a].emoji === newCards[b].emoji;

      setTimeout(() => {
        if (match) {
          const updated = newCards.map((c, i) =>
            i === a || i === b ? { ...c, matched: true } : c,
          );
          setCards(updated);
          const newMatched = matched + 1;
          setMatched(newMatched);

          if (newMatched === pairs) {
            setFinished(true);
            speak('¡Encontraste todos los pares!');
            onRoundComplete(true, 0).then(() => {
              setTimeout(() => onGameFinish(), 800);
            });
          }
        } else {
          setCards(newCards.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c,
          ));
        }
        setFlipped([]);
        setLocked(false);
      }, flipDelay);
    }
  }, [cards, flipped, matched, pairs, flipDelay, locked, finished, onRoundComplete, onGameFinish, scaleAnims]);

  const cols = pairs <= 4 ? 2 : pairs <= 6 ? 3 : 4;
  const cardSize = pairs <= 4 ? 88 : pairs <= 6 ? 76 : 64;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Pares: {matched} / {pairs}</Text>
      <Text style={styles.instruction}>¡Encontrá los pares! 🌟</Text>

      <View style={[styles.grid, { maxWidth: cols * (cardSize + 10) + 16 }]}>
        {cards.map((card, idx) => {
          const scale = scaleAnims[idx] ?? new Animated.Value(1);
          return (
            <Animated.View key={card.id} style={{ transform: [{ scale }] }}>
              <TouchableOpacity
                style={[
                  styles.card,
                  { width: cardSize, height: cardSize },
                  card.flipped && !card.matched && styles.cardFlipped,
                  card.matched && styles.cardMatched,
                ]}
                onPress={() => handleCardPress(idx)}
                disabled={card.flipped || card.matched || locked}
              >
                {(card.flipped || card.matched) ? (
                  <Text style={{ fontSize: cardSize * 0.48 }}>{card.emoji}</Text>
                ) : (
                  <Text style={styles.cardBack}>🔮</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {finished && (
        <Text style={[styles.badge, { backgroundColor: '#7B1FA2' }]}>
          ¡Ganaste! 🎉 {pairs} pares encontrados
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#F3E5F5',
  },
  progress:    { fontSize: 16, color: '#7B1FA2', fontWeight: '600', marginBottom: 4 },
  instruction: { fontSize: 20, fontWeight: '700', color: '#4A148C', marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: 14,
    backgroundColor: '#CE93D8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
  cardFlipped: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#AB47BC',
  },
  cardMatched: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cardBack: { fontSize: 32 },
  badge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
