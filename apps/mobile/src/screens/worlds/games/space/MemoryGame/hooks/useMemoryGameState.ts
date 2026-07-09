import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../../GameScreen';
import { buildDeck, type Card } from '../logic/buildDeck';

export interface UseMemoryGameStateOptions {
  pairs: number;
  flipDelay: number;
  onRoundComplete: GameProps['onRoundComplete'];
  onGameFinish: () => void;
}

/** Owns the flip/match/lock state machine for the memory game's single "match all pairs" round. */
export function useMemoryGameState({ pairs, flipDelay, onRoundComplete, onGameFinish }: UseMemoryGameStateOptions) {
  const [cards, setCards] = useState<Card[]>(() => buildDeck(pairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState(0);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const scaleAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    while (scaleAnims.length < pairs * 2) {
      scaleAnims.push(new Animated.Value(1));
    }
    speak('¡Encontrá los pares! Tocá las cartas');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardPress = useCallback((cardIdx: number) => {
    if (locked || finished) return;
    const card = cards[cardIdx];
    if (card.flipped || card.matched) return;
    if (flipped.length >= 2) return;

    const anim = scaleAnims[cardIdx] ?? new Animated.Value(1);
    Animated.spring(anim, { toValue: 1.08, friction: 5, useNativeDriver: true }).start(() => {
      Animated.spring(anim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    });

    const newCards = cards.map((c, i) => (i === cardIdx ? { ...c, flipped: true } : c));
    const newFlipped = [...flipped, cardIdx];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      const [a, b] = newFlipped;
      const match = newCards[a].emoji === newCards[b].emoji;

      setTimeout(() => {
        if (match) {
          const updated = newCards.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
          setCards(updated);
          const newMatched = matched + 1;
          setMatched(newMatched);

          if (newMatched === pairs) {
            setFinished(true);
            speak('¡Encontraste todos los pares!');
            onRoundComplete(true, 0).then(() => setTimeout(onGameFinish, 800));
          }
        } else {
          setCards(newCards.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
        }
        setFlipped([]);
        setLocked(false);
      }, flipDelay);
    }
  }, [cards, flipped, matched, pairs, flipDelay, locked, finished, onRoundComplete, onGameFinish, scaleAnims]);

  return { cards, matched, finished, locked, scaleAnims, handleCardPress };
}
