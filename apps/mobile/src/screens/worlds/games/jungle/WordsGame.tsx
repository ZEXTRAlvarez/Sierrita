import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { getWords, getBlanks, getLetterOptions } from '@sierrita/games';
import type { WordEntry } from '@sierrita/games';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../GameScreen';

export default function WordsGame({
  difficulty,
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const wordLength = (params.wordLength as 3 | 4 | 5) || 3;
  const blanks     = (params.blanks as number) || 1;
  const category   = (params.category as 'animals' | 'objects' | 'mixed') || 'animals';

  const words        = useRef<WordEntry[]>([]);
  const blankIndices = useRef<number[]>([]);
  const options      = useRef<string[]>([]);

  const [wordIdx, setWordIdx]       = useState(0);
  const [chosen, setChosen]         = useState<(string | null)[]>([]);
  const [result, setResult]         = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone] = useState(0);
  const shakeAnim                   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const list = getWords(wordLength, category, roundCount);
    // Pad if not enough words
    while (list.length < roundCount) list.push(...list);
    words.current = list.slice(0, roundCount);
    initRound(0, words.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initRound(idx: number, list: WordEntry[]) {
    const entry = list[idx];
    if (!entry) return;
    const bi = getBlanks(entry.word, blanks);
    blankIndices.current = bi;
    options.current = getLetterOptions(entry.word, bi);
    setChosen(bi.map(() => null));
    setResult('idle');
    speak(`Completá la palabra: ${spellWord(entry.word, bi)}`);
  }

  function spellWord(word: string, blankIdx: number[]) {
    return word.split('').map((l, i) => (blankIdx.includes(i) ? '...' : l)).join(' ');
  }

  const currentEntry = words.current[wordIdx];

  const handleLetterPress = useCallback((letter: string) => {
    if (result !== 'idle') return;
    setChosen((prev) => {
      const firstEmpty = prev.findIndex((v) => v === null);
      if (firstEmpty === -1) return prev;
      const next = [...prev];
      next[firstEmpty] = letter;
      return next;
    });
  }, [result]);

  // Auto-evaluate when all blanks filled
  useEffect(() => {
    if (result !== 'idle' || !currentEntry) return;
    if (chosen.includes(null)) return;

    const correct = blankIndices.current.every(
      (bi, i) => chosen[i] === currentEntry.word[bi],
    );

    if (correct) {
      setResult('correct');
      onRoundComplete(true, 0).then(() => {
        const next = roundsDone + 1;
        setRoundsDone(next);
        if (next >= roundCount) {
          setTimeout(() => onGameFinish(), 900);
        } else {
          setTimeout(() => {
            const nextIdx = wordIdx + 1;
            setWordIdx(nextIdx);
            initRound(nextIdx, words.current);
          }, 900);
        }
      });
    } else {
      setResult('wrong');
      shake();
      onRoundComplete(false, 0).then(() => {
        setTimeout(() => {
          // Reset blanks, keep word
          setChosen(blankIndices.current.map(() => null));
          setResult('idle');
        }, 800);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  function shake() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  }

  if (!currentEntry) return null;

  const { word, emoji } = currentEntry;

  return (
    <View style={styles.container}>
      {/* Emoji */}
      <Text style={styles.emoji}>{emoji}</Text>

      {/* Progress */}
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>

      {/* Word display with blanks */}
      <Animated.View
        style={[styles.wordRow, { transform: [{ translateX: shakeAnim }] }]}
      >
        {word.split('').map((letter, i) => {
          const isBlank = blankIndices.current.includes(i);
          const blankPos = blankIndices.current.indexOf(i);
          return (
            <View
              key={i}
              style={[
                styles.letterBox,
                isBlank && styles.blankBox,
                isBlank && result === 'correct' && styles.correctBox,
                isBlank && result === 'wrong'   && styles.wrongBox,
              ]}
            >
              <Text style={styles.letterText}>
                {isBlank ? (chosen[blankPos] ?? '') : letter}
              </Text>
            </View>
          );
        })}
      </Animated.View>

      {/* Erase last */}
      <TouchableOpacity
        style={styles.eraseBtn}
        onPress={() => {
          if (result !== 'idle') return;
          setChosen((prev) => {
            const next = [...prev];
            const lastFilled = next.map((v, i) => (v !== null ? i : -1)).filter((v) => v !== -1).pop();
            if (lastFilled !== undefined) next[lastFilled] = null;
            return next;
          });
        }}
      >
        <Text style={styles.eraseText}>⌫ Borrar</Text>
      </TouchableOpacity>

      {/* Letter options */}
      <View style={styles.optionsRow}>
        {options.current.map((letter, i) => (
          <TouchableOpacity
            key={i}
            style={styles.optionBtn}
            onPress={() => handleLetterPress(letter)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{letter}</Text>
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
          ¡Casi! Intentá de nuevo 💪
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
    fontSize: 72,
    marginBottom: 4,
  },
  progress: {
    fontSize: 16,
    color: '#66BB6A',
    marginBottom: 16,
    fontWeight: '600',
  },
  wordRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  letterBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A5D6A7',
  },
  blankBox: {
    backgroundColor: '#FFF9C4',
    borderColor: '#F9A825',
    borderStyle: 'dashed',
  },
  correctBox: {
    backgroundColor: '#A5D6A7',
    borderColor: '#4CAF50',
  },
  wrongBox: {
    backgroundColor: '#FFCDD2',
    borderColor: '#F44336',
  },
  letterText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1B5E20',
  },
  eraseBtn: {
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  eraseText: {
    fontSize: 15,
    color: '#388E3C',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    maxWidth: 360,
  },
  optionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  optionText: {
    fontSize: 24,
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
