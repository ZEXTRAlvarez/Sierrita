import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../GameScreen';

type Operation = 'add' | 'sub';

interface Problem {
  a: number;
  b: number;
  op: Operation;
  result: number;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(maxOperand: number, operations: string[], resultMax: number): Problem {
  const ops = operations as Operation[];
  let a: number, b: number, op: Operation, result: number;
  let tries = 0;
  do {
    tries++;
    op = ops[Math.floor(Math.random() * ops.length)];
    a  = rand(1, maxOperand);
    b  = rand(1, maxOperand);
    if (op === 'sub') {
      if (a < b) [a, b] = [b, a];   // no negatives
      result = a - b;
    } else {
      result = a + b;
    }
  } while (result < 0 || result > resultMax || result === 0 && tries < 10);

  return { a, b, op, result };
}

function generateOptions(correct: number, max: number): number[] {
  const spread = Math.max(3, Math.floor(max / 8));
  const opts = new Set<number>([correct]);
  let attempts = 0;
  while (opts.size < 4 && attempts < 40) {
    attempts++;
    const n = correct + rand(-spread, spread);
    if (n >= 0 && n <= max) opts.add(n);
  }
  for (let i = 0; opts.size < 4; i++) {
    const n = correct + i + 1;
    if (n <= max) opts.add(n);
  }
  return [...opts].sort(() => Math.random() - 0.5).slice(0, 4);
}

function VisualBlocks({ a, b, op }: { a: number; b: number; op: Operation }) {
  const showVisual = a <= 10 && b <= 10;
  if (!showVisual) return null;
  return (
    <View style={styles.visualRow}>
      <View style={styles.blockGroup}>
        {Array.from({ length: a }).map((_, i) => (
          <View key={i} style={[styles.block, { backgroundColor: '#1565C0' }]} />
        ))}
      </View>
      <Text style={styles.opSymbol}>{op === 'add' ? '+' : '−'}</Text>
      <View style={styles.blockGroup}>
        {Array.from({ length: b }).map((_, i) => (
          <View key={i} style={[styles.block, { backgroundColor: op === 'add' ? '#0288D1' : '#F44336' }]} />
        ))}
      </View>
    </View>
  );
}

export default function SumsGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const maxOperand = (params.maxOperand as number) || 10;
  const operations = (params.operations as string[]) || ['add'];
  const resultMax  = (params.resultMax as number) || 10;

  const [problem, setProblem]       = useState<Problem | null>(null);
  const [options, setOptions]       = useState<number[]>([]);
  const [result, setResult]         = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone] = useState(0);
  const shakeAnim                   = useRef(new Animated.Value(0)).current;

  useEffect(() => { newRound(); }, []);

  function newRound() {
    const p = generateProblem(maxOperand, operations, resultMax);
    setProblem(p);
    setOptions(generateOptions(p.result, resultMax));
    setResult('idle');
    const opWord = p.op === 'add' ? 'más' : 'menos';
    speak(`${p.a} ${opWord} ${p.b} es igual a...`);
  }

  function shake() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  const handleAnswer = useCallback(async (answer: number) => {
    if (!problem || result !== 'idle') return;
    const correct = answer === problem.result;
    setResult(correct ? 'correct' : 'wrong');
    if (!correct) shake();
    await onRoundComplete(correct, 0);
    const next = roundsDone + 1;
    setRoundsDone(next);
    if (next >= roundCount) {
      setTimeout(() => onGameFinish(), 900);
    } else {
      setTimeout(() => newRound(), 900);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem, result, roundsDone, roundCount, onRoundComplete, onGameFinish]);

  if (!problem) return null;

  const opSymbol = problem.op === 'add' ? '+' : '−';

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>

      {/* Equation */}
      <Animated.View
        style={[styles.equationBox, { transform: [{ translateX: shakeAnim }] }]}
      >
        <Text style={styles.equationText}>
          {problem.a} {opSymbol} {problem.b} = ?
        </Text>
      </Animated.View>

      {/* Visual blocks for small numbers */}
      <VisualBlocks a={problem.a} b={problem.b} op={problem.op} />

      {/* Answer options */}
      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionBtn,
              result !== 'idle' && opt === problem.result && styles.correctBtn,
              result === 'wrong' && opt !== problem.result && styles.dimBtn,
            ]}
            onPress={() => handleAnswer(opt)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && <Text style={[styles.badge, { backgroundColor: '#1565C0' }]}>¡Correcto! ⭐</Text>}
      {result === 'wrong'   && <Text style={[styles.badge, { backgroundColor: '#F44336' }]}>¡Casi! La respuesta es {problem.result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#E3F2FD',
  },
  progress: { fontSize: 16, color: '#1976D2', fontWeight: '600', marginBottom: 8 },
  equationBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginBottom: 16,
  },
  equationText: {
    fontSize: 46,
    fontWeight: '900',
    color: '#0D47A1',
    letterSpacing: 2,
  },
  visualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  blockGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    maxWidth: 120,
    justifyContent: 'center',
  },
  block: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  opSymbol: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1565C0',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  optionBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  dimBtn: { opacity: 0.4 },
  optionText: { fontSize: 28, fontWeight: '900', color: '#fff' },
  badge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
});
