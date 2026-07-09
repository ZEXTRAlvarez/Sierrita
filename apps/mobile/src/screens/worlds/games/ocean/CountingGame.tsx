import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView,
} from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../GameScreen';

const OBJECTS = ['🐟', '🐠', '🦀', '🐙', '🦑', '🐚', '🪸', '🦞'];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOptions(correct: number, max: number): number[] {
  const spread = Math.max(3, Math.floor(max / 8));
  const opts = new Set<number>([correct]);
  let attempts = 0;
  while (opts.size < 4 && attempts < 40) {
    attempts++;
    const n = correct + rand(-spread, spread);
    if (n >= 1 && n <= max && n !== correct) opts.add(n);
  }
  // Fallback if max is small
  for (let i = 1; opts.size < 4 && i <= max; i++) {
    if (i !== correct) opts.add(i);
  }
  return [...opts].sort(() => Math.random() - 0.5).slice(0, 4);
}

function ObjectGrid({ count, emoji }: { count: number; emoji: string }) {
  if (count <= 20) {
    return (
      <View style={styles.objectGrid}>
        {Array.from({ length: count }).map((_, i) => (
          <Text key={i} style={styles.objectEmoji}>{emoji}</Text>
        ))}
      </View>
    );
  }
  const tens  = Math.floor(count / 10);
  const units = count % 10;
  return (
    <View style={styles.objectGrid}>
      {Array.from({ length: tens }).map((_, i) => (
        <View key={`t${i}`} style={styles.groupBox}>
          <Text style={styles.groupLabel}>10</Text>
          <Text style={styles.objectEmoji}>{emoji}</Text>
        </View>
      ))}
      {Array.from({ length: units }).map((_, i) => (
        <Text key={`u${i}`} style={styles.objectEmoji}>{emoji}</Text>
      ))}
    </View>
  );
}

export default function CountingGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const maxNumber = (params.maxNumber as number) || 10;
  const emojiRef  = useRef(OBJECTS[Math.floor(Math.random() * OBJECTS.length)]);

  const [target, setTarget]         = useState(0);
  const [options, setOptions]       = useState<number[]>([]);
  const [result, setResult]         = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone] = useState(0);
  const bounceAnim                  = useRef(new Animated.Value(1)).current;

  useEffect(() => { newRound(); }, []);

  function newRound() {
    const n = rand(1, maxNumber);
    setTarget(n);
    setOptions(generateOptions(n, maxNumber));
    setResult('idle');
    speak('¿Cuántos hay? Contálos');
  }

  function bounce() {
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }

  const handleAnswer = useCallback(async (answer: number) => {
    if (result !== 'idle') return;
    const correct = answer === target;
    setResult(correct ? 'correct' : 'wrong');
    bounce();
    await onRoundComplete(correct, 0);
    const next = roundsDone + 1;
    setRoundsDone(next);
    if (next >= roundCount) {
      setTimeout(() => onGameFinish(), 900);
    } else {
      setTimeout(() => newRound(), 900);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, target, roundsDone, roundCount, onRoundComplete, onGameFinish]);

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>
      <Text style={styles.question}>¿Cuántos hay?</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} style={{ flex: 1, width: '100%' }}>
        <Animated.View style={{ transform: [{ scale: bounceAnim }], alignItems: 'center' }}>
          <ObjectGrid count={target} emoji={emojiRef.current} />
        </Animated.View>
      </ScrollView>

      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionBtn,
              result !== 'idle' && opt === target && styles.correctBtn,
            ]}
            onPress={() => handleAnswer(opt)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && <Text style={[styles.badge, { backgroundColor: '#1565C0' }]}>¡Correcto! ⭐</Text>}
      {result === 'wrong'   && <Text style={[styles.badge, { backgroundColor: '#F44336' }]}>¡Casi! 💪</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#E3F2FD',
  },
  progress: { fontSize: 16, color: '#1976D2', fontWeight: '600', marginBottom: 4 },
  question: { fontSize: 22, fontWeight: '800', color: '#0D47A1', marginBottom: 12 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  objectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    maxWidth: 320,
  },
  objectEmoji: { fontSize: 30 },
  groupBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(33,150,243,0.18)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    margin: 2,
  },
  groupLabel: { fontSize: 11, color: '#1565C0', fontWeight: '800' },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  correctBtn: { backgroundColor: '#4CAF50' },
  optionText: { fontSize: 26, fontWeight: '900', color: '#fff' },
  badge: {
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
