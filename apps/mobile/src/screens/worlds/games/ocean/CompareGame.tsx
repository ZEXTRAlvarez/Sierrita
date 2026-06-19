import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { speak } from '../../../../../../../libs/audio/src/audioManager';
import type { GameProps } from '../../GameScreen';

type Mode = 'visual' | 'number' | 'expression';
type Symbol = '>' | '<' | '=';

interface Problem {
  left: number;
  right: number;
  answer: Symbol;
}

const VISUAL_EMOJI = ['⭐', '🐠', '🌊', '🪸', '🐚'];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSymbol(a: number, b: number): Symbol {
  if (a > b) return '>';
  if (a < b) return '<';
  return '=';
}

function generateProblem(maxNumber: number, mode: Mode): Problem {
  let left: number, right: number;

  if (mode === 'visual') {
    // Small numbers for visual counting
    left  = rand(1, Math.min(10, maxNumber));
    right = rand(1, Math.min(10, maxNumber));
  } else if (mode === 'expression') {
    // A = a+b, B = c (or d+e)
    const a = rand(1, Math.floor(maxNumber / 4));
    const b = rand(1, Math.floor(maxNumber / 4));
    left  = a + b;
    right = rand(Math.max(1, left - 5), Math.min(maxNumber, left + 5));
  } else {
    left  = rand(1, maxNumber);
    right = rand(1, maxNumber);
  }

  return { left, right, answer: getSymbol(left, right) };
}

function VisualGroup({ count, emoji }: { count: number; emoji: string }) {
  return (
    <View style={styles.visualGroup}>
      {Array.from({ length: count }).map((_, i) => (
        <Text key={i} style={styles.visualEmoji}>{emoji}</Text>
      ))}
    </View>
  );
}

export default function CompareGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const maxNumber = (params.maxNumber as number) || 20;
  const mode      = (params.mode as Mode) || 'visual';

  const emojiRef = useRef(VISUAL_EMOJI[Math.floor(Math.random() * VISUAL_EMOJI.length)]);

  const [problem, setProblem]       = useState<Problem>(() => generateProblem(maxNumber, mode));
  const [chosen, setChosen]         = useState<Symbol | null>(null);
  const [result, setResult]         = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone] = useState(0);
  const bounceAnim                  = useRef(new Animated.Value(1)).current;

  useEffect(() => { announceProblem(problem, mode); }, []);

  function announceProblem(p: Problem, m: Mode) {
    if (m === 'visual') {
      speak(`¿Cuál lado tiene más? Tocá el símbolo correcto`);
    } else if (m === 'expression') {
      speak(`Compará los dos lados. ¿Mayor, menor o igual?`);
    } else {
      speak(`Compará ${p.left} y ${p.right}. ¿Mayor, menor o igual?`);
    }
  }

  function bounce() {
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }

  const handleSymbol = useCallback(async (sym: Symbol) => {
    if (result !== 'idle') return;
    setChosen(sym);
    const correct = sym === problem.answer;
    setResult(correct ? 'correct' : 'wrong');
    bounce();
    await onRoundComplete(correct, 0);
    const next = roundsDone + 1;
    setRoundsDone(next);
    if (next >= roundCount) {
      setTimeout(() => onGameFinish(), 900);
    } else {
      setTimeout(() => {
        const p = generateProblem(maxNumber, mode);
        setProblem(p);
        setChosen(null);
        setResult('idle');
        announceProblem(p, mode);
      }, 900);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, problem, roundsDone, roundCount, maxNumber, mode, onRoundComplete, onGameFinish]);

  function renderLeft() {
    if (mode === 'visual') {
      return <VisualGroup count={problem.left} emoji={emojiRef.current} />;
    }
    if (mode === 'expression') {
      // Show as "a + b"
      const half = Math.floor(problem.left / 2);
      const rest = problem.left - half;
      return (
        <Text style={styles.expressionText}>{half} + {rest}</Text>
      );
    }
    return <Text style={styles.numberText}>{problem.left}</Text>;
  }

  function renderRight() {
    if (mode === 'visual') {
      return <VisualGroup count={problem.right} emoji={emojiRef.current} />;
    }
    return <Text style={styles.numberText}>{problem.right}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>

      <Text style={styles.instruction}>
        {mode === 'visual'      ? '¿Cuál lado tiene más?' :
         mode === 'expression'  ? '¿Mayor, menor o igual?' :
                                  '¿Mayor, menor o igual?'}
      </Text>

      {/* Comparison display */}
      <Animated.View style={[styles.comparisonRow, { transform: [{ scale: bounceAnim }] }]}>
        <View style={styles.side}>{renderLeft()}</View>
        <View style={styles.symbolSlot}>
          <Text style={styles.questionMark}>?</Text>
        </View>
        <View style={styles.side}>{renderRight()}</View>
      </Animated.View>

      {/* Symbol buttons */}
      <View style={styles.symbolRow}>
        {(['>', '<', '='] as Symbol[]).map((sym) => (
          <TouchableOpacity
            key={sym}
            style={[
              styles.symbolBtn,
              chosen === sym && result === 'correct' && styles.correctSymBtn,
              chosen === sym && result === 'wrong'   && styles.wrongSymBtn,
              result !== 'idle' && sym === problem.answer && styles.correctSymBtn,
            ]}
            onPress={() => handleSymbol(sym)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.symbolBtnText}>{sym}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && (
        <Text style={[styles.badge, { backgroundColor: '#1565C0' }]}>
          {problem.left} {problem.answer} {problem.right} ✓ ⭐
        </Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, { backgroundColor: '#F44336' }]}>
          La respuesta es {problem.answer} 💪
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
    backgroundColor: '#E3F2FD',
  },
  progress: { fontSize: 16, color: '#1976D2', fontWeight: '600', marginBottom: 4 },
  instruction: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D47A1',
    marginBottom: 16,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  side: {
    flex: 1,
    alignItems: 'center',
    minHeight: 100,
    backgroundColor: '#BBDEFB',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'center',
  },
  visualGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    maxWidth: 130,
  },
  visualEmoji: { fontSize: 24 },
  numberText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#0D47A1',
  },
  expressionText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0D47A1',
    textAlign: 'center',
  },
  symbolSlot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 24,
    fontWeight: '900',
    color: '#90CAF9',
  },
  symbolRow: {
    flexDirection: 'row',
    gap: 20,
  },
  symbolBtn: {
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
  correctSymBtn: { backgroundColor: '#4CAF50' },
  wrongSymBtn:   { backgroundColor: '#F44336' },
  symbolBtnText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 42,
  },
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
