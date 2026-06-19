import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { getSentences, shuffleWords } from '../../../../../../../libs/games/writing/sentenceData';
import type { SentenceEntry } from '../../../../../../../libs/games/writing/sentenceData';
import { speak } from '../../../../../../../libs/audio/src/audioManager';
import type { GameProps } from '../../GameScreen';

export default function SentencesGame({
  difficulty,
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const wordCount = (params.wordCount as 3 | 4 | 5) || 3;

  const sentences = useRef<SentenceEntry[]>([]);
  const shuffled  = useRef<string[]>([]);

  const [sentIdx, setSentIdx]         = useState(0);
  const [placed, setPlaced]           = useState<string[]>([]);
  const [available, setAvailable]     = useState<string[]>([]);
  const [result, setResult]           = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone]   = useState(0);
  const shakeAnim                     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const list = getSentences(wordCount, roundCount);
    while (list.length < roundCount) list.push(...list);
    sentences.current = list.slice(0, roundCount);
    initRound(0, sentences.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initRound(idx: number, list: SentenceEntry[]) {
    const entry = list[idx];
    if (!entry) return;
    const sh = shuffleWords(entry.words);
    shuffled.current = sh;
    setAvailable(sh);
    setPlaced([]);
    setResult('idle');
    speak('Ordená las palabras para formar la oración');
  }

  const currentSentence = sentences.current[sentIdx];

  const placeWord = useCallback((word: string, fromIdx: number) => {
    if (result !== 'idle') return;
    setAvailable((prev) => prev.filter((_, i) => i !== fromIdx));
    setPlaced((prev) => [...prev, word]);
  }, [result]);

  const removeWord = useCallback((word: string, fromIdx: number) => {
    if (result !== 'idle') return;
    setPlaced((prev) => prev.filter((_, i) => i !== fromIdx));
    setAvailable((prev) => [...prev, word]);
  }, [result]);

  // Check when all words are placed
  useEffect(() => {
    if (!currentSentence || result !== 'idle') return;
    if (available.length > 0) return;

    const isCorrect = placed.join(' ') === currentSentence.words.join(' ');

    if (isCorrect) {
      setResult('correct');
      onRoundComplete(true, 0).then(() => {
        const next = roundsDone + 1;
        setRoundsDone(next);
        if (next >= roundCount) {
          setTimeout(() => onGameFinish(), 900);
        } else {
          setTimeout(() => {
            const nextIdx = sentIdx + 1;
            setSentIdx(nextIdx);
            initRound(nextIdx, sentences.current);
          }, 900);
        }
      });
    } else {
      setResult('wrong');
      shake();
      speak('Eso no es correcto. ¡Intentá de nuevo!');
      onRoundComplete(false, 0).then(() => {
        setTimeout(() => {
          initRound(sentIdx, sentences.current);
        }, 1000);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available, placed]);

  function shake() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  if (!currentSentence) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{currentSentence.emoji}</Text>

      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>

      <Text style={styles.instruction}>Ordená las palabras</Text>

      {/* Placed words tray */}
      <Animated.View
        style={[styles.tray, { transform: [{ translateX: shakeAnim }] }]}
      >
        {placed.map((word, i) => (
          <TouchableOpacity
            key={`placed-${i}`}
            style={[
              styles.wordChip,
              result === 'correct' && styles.correctChip,
              result === 'wrong'   && styles.wrongChip,
            ]}
            onPress={() => removeWord(word, i)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
        {placed.length === 0 && (
          <Text style={styles.trayPlaceholder}>Tocá las palabras de abajo</Text>
        )}
      </Animated.View>

      {/* Available word bank */}
      <View style={styles.wordBank}>
        {available.map((word, i) => (
          <TouchableOpacity
            key={`avail-${i}`}
            style={styles.wordChip}
            onPress={() => placeWord(word, i)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && (
        <Text style={[styles.badge, { backgroundColor: '#4CAF50' }]}>
          ¡Perfecto! ⭐
        </Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, { backgroundColor: '#F44336' }]}>
          ¡Revisa el orden! 🔄
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#F1F8E9',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 4,
  },
  progress: {
    fontSize: 16,
    color: '#66BB6A',
    fontWeight: '600',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 18,
    color: '#388E3C',
    fontWeight: '700',
    marginBottom: 16,
  },
  tray: {
    minHeight: 64,
    width: '90%',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#A5D6A7',
    borderStyle: 'dashed',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
    gap: 8,
    marginBottom: 20,
  },
  trayPlaceholder: {
    color: '#A5D6A7',
    fontSize: 14,
    fontStyle: 'italic',
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    maxWidth: 380,
  },
  wordChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  correctChip: {
    backgroundColor: '#2E7D32',
  },
  wrongChip: {
    backgroundColor: '#F44336',
  },
  wordText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
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
