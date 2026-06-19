import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { speak } from '../../../../../../../libs/audio/src/audioManager';
import type { GameProps } from '../../GameScreen';

type Mode = 'identify' | 'decompose' | 'compose';

interface Problem {
  number: number;
  hundreds: number;
  tens: number;
  units: number;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function decompose(n: number): { hundreds: number; tens: number; units: number } {
  const hundreds = Math.floor(n / 100);
  const tens     = Math.floor((n % 100) / 10);
  const units    = n % 10;
  return { hundreds, tens, units };
}

function generateProblem(maxNumber: number): Problem {
  const n = rand(10, maxNumber);
  return { number: n, ...decompose(n) };
}

function generateNumOptions(correct: number, max: number): number[] {
  const spread = Math.max(10, Math.floor(max / 5));
  const opts = new Set<number>([correct]);
  let attempts = 0;
  while (opts.size < 4 && attempts < 40) {
    attempts++;
    const n = correct + rand(-spread, spread);
    if (n >= 0 && n <= max && n !== correct) opts.add(n);
  }
  for (let i = 1; opts.size < 4; i++) {
    if (correct + i <= max) opts.add(correct + i);
  }
  return [...opts].sort(() => Math.random() - 0.5).slice(0, 4);
}

function generateDigitOptions(correct: number, label: string): number[] {
  const opts = new Set<number>([correct]);
  while (opts.size < 4) {
    const n = rand(0, 9);
    opts.add(n);
  }
  return [...opts].sort(() => Math.random() - 0.5);
}

// ── Modo: identify ───────────────────────────────────────────────────────────
// Muestra un número, pregunta cuántas centenas/decenas/unidades tiene
function IdentifyMode({
  problem,
  onAnswer,
  result,
}: {
  problem: Problem;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}) {
  const questionType = useRef<'hundreds' | 'tens' | 'units'>(
    (() => {
      // Solo preguntamos por centenas cuando el número realmente puede tenerlas;
      // si no, la respuesta sería siempre 0 sin importar el número mostrado.
      const types = problem.number >= 100
        ? (['hundreds', 'tens', 'units'] as const)
        : (['tens', 'units'] as const);
      return types[rand(0, types.length - 1)];
    })(),
  ).current;

  const correctValue =
    questionType === 'hundreds' ? problem.hundreds :
    questionType === 'tens'     ? problem.tens :
    problem.units;

  const label =
    questionType === 'hundreds' ? 'centenas' :
    questionType === 'tens'     ? 'decenas'  : 'unidades';

  const options = useRef(generateDigitOptions(correctValue, label)).current;

  return (
    <View style={styles.modeContainer}>
      <Text style={styles.bigNumber}>{problem.number}</Text>
      <Text style={styles.modeQuestion}>¿Cuántas {label} tiene?</Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionBtn,
              result !== 'idle' && opt === correctValue && styles.correctBtn,
              result === 'wrong' && opt !== correctValue && styles.dimBtn,
            ]}
            onPress={() => onAnswer(opt === correctValue)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Modo: decompose ──────────────────────────────────────────────────────────
// Muestra un número, el niño elige H, D y U por separado
function DecomposeMode({
  problem,
  onAnswer,
  result,
}: {
  problem: Problem;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}) {
  const [chosen, setChosen] = useState<{ h: number | null; d: number | null; u: number | null }>({
    h: null, d: null, u: null,
  });

  const hOptions = useRef(generateDigitOptions(problem.hundreds, 'h')).current;
  const dOptions = useRef(generateDigitOptions(problem.tens, 'd')).current;
  const uOptions = useRef(generateDigitOptions(problem.units, 'u')).current;

  useEffect(() => {
    if (chosen.h !== null && chosen.d !== null && chosen.u !== null) {
      const correct =
        chosen.h === problem.hundreds &&
        chosen.d === problem.tens &&
        chosen.u === problem.units;
      onAnswer(correct);
    }
  }, [chosen]);

  function DigitRow({ label, options, value, field }: {
    label: string;
    options: number[];
    value: number | null;
    field: 'h' | 'd' | 'u';
  }) {
    return (
      <View style={styles.decomposeRow}>
        <Text style={styles.decomposeLabel}>{label}</Text>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.digitBtn,
              value === opt && styles.selectedBtn,
            ]}
            onPress={() => {
              if (result !== 'idle') return;
              setChosen((prev) => ({ ...prev, [field]: opt }));
            }}
            disabled={result !== 'idle'}
          >
            <Text style={styles.digitText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.modeContainer}>
      <Text style={styles.bigNumber}>{problem.number}</Text>
      <Text style={styles.modeQuestion}>Descomponé el número</Text>
      <DigitRow label="C" options={hOptions} value={chosen.h} field="h" />
      <DigitRow label="D" options={dOptions} value={chosen.d} field="d" />
      <DigitRow label="U" options={uOptions} value={chosen.u} field="u" />
    </View>
  );
}

// ── Modo: compose ─────────────────────────────────────────────────────────────
// Muestra H + D + U y el niño elige el número correcto
function ComposeMode({
  problem,
  maxNumber,
  onAnswer,
  result,
}: {
  problem: Problem;
  maxNumber: number;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}) {
  const options = useRef(generateNumOptions(problem.number, maxNumber)).current;

  return (
    <View style={styles.modeContainer}>
      <View style={styles.composeExpression}>
        <Text style={styles.composeUnit}>{problem.hundreds} C</Text>
        <Text style={styles.composePlus}>+</Text>
        <Text style={styles.composeUnit}>{problem.tens} D</Text>
        <Text style={styles.composePlus}>+</Text>
        <Text style={styles.composeUnit}>{problem.units} U</Text>
      </View>
      <Text style={styles.modeQuestion}>¿Qué número es?</Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionBtn,
              result !== 'idle' && opt === problem.number && styles.correctBtn,
              result === 'wrong' && opt !== problem.number && styles.dimBtn,
            ]}
            onPress={() => onAnswer(opt === problem.number)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function HundredsGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const maxNumber = (params.maxNumber as number) || 99;
  const mode      = (params.mode as Mode) || 'identify';

  const [problem, setProblem]       = useState<Problem>(() => generateProblem(maxNumber));
  const [result, setResult]         = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone] = useState(0);
  const bounceAnim                  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    announceRound(problem, mode);
  }, []);

  function announceRound(p: Problem, m: Mode) {
    if (m === 'identify') {
      speak(`¿Cuántas centenas, decenas y unidades tiene el ${p.number}?`);
    } else if (m === 'decompose') {
      speak(`Descomponé el número ${p.number} en centenas, decenas y unidades`);
    } else {
      speak(`${p.hundreds} centenas más ${p.tens} decenas más ${p.units} unidades. ¿Qué número es?`);
    }
  }

  function bounce() {
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }

  const handleAnswer = useCallback(async (correct: boolean) => {
    if (result !== 'idle') return;
    setResult(correct ? 'correct' : 'wrong');
    bounce();
    await onRoundComplete(correct, 0);
    const next = roundsDone + 1;
    if (next >= roundCount) {
      setTimeout(() => onGameFinish(), 900);
    } else {
      setTimeout(() => {
        // Avanzamos roundsDone y problem juntos: el componente de modo se
        // remonta (key={roundsDone}) justo cuando llega el número nuevo, así
        // sus opciones (generadas una sola vez vía useRef) coinciden con él.
        const p = generateProblem(maxNumber);
        setRoundsDone(next);
        setProblem(p);
        setResult('idle');
        announceRound(p, mode);
      }, 900);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, roundsDone, roundCount, maxNumber, mode, onRoundComplete, onGameFinish]);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: bounceAnim }] }]}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>

      {mode === 'identify'  && <IdentifyMode  key={roundsDone} problem={problem} onAnswer={handleAnswer} result={result} />}
      {mode === 'decompose' && <DecomposeMode key={roundsDone} problem={problem} onAnswer={handleAnswer} result={result} />}
      {mode === 'compose'   && <ComposeMode   key={roundsDone} problem={problem} maxNumber={maxNumber} onAnswer={handleAnswer} result={result} />}

      {result === 'correct' && <Text style={[styles.badge, { backgroundColor: '#1565C0' }]}>¡Correcto! ⭐</Text>}
      {result === 'wrong'   && <Text style={[styles.badge, { backgroundColor: '#F44336' }]}>¡Inténtalo! 💪</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#E3F2FD',
  },
  progress: { fontSize: 16, color: '#1976D2', fontWeight: '600', marginBottom: 8 },
  modeContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  bigNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: '#0D47A1',
    lineHeight: 92,
    marginBottom: 4,
  },
  modeQuestion: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
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
  optionText: { fontSize: 24, fontWeight: '900', color: '#fff' },
  decomposeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  decomposeLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0D47A1',
    width: 28,
  },
  digitBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#90CAF9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#42A5F5',
  },
  selectedBtn: {
    backgroundColor: '#1565C0',
    borderColor: '#0D47A1',
  },
  digitText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  composeExpression: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  composeUnit: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0D47A1',
    backgroundColor: '#BBDEFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  composePlus: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1565C0',
  },
  badge: {
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
