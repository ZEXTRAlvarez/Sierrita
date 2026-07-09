import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { generateDigitOptions } from '../../logic/generateDigitOptions';
import type { Problem } from '../../logic/generateProblem';
import { styles } from './DecomposeMode.styles';

export interface DecomposeModeProps {
  problem: Problem;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}

type Chosen = { h: number | null; d: number | null; u: number | null };
type Field = keyof Chosen;

/** Shows a number and lets the child pick its hundreds, tens and units digits separately. */
export function DecomposeMode({ problem, onAnswer, result }: DecomposeModeProps) {
  const [chosen, setChosen] = useState<Chosen>({ h: null, d: null, u: null });

  const hOptions = useRef(generateDigitOptions(problem.hundreds)).current;
  const dOptions = useRef(generateDigitOptions(problem.tens)).current;
  const uOptions = useRef(generateDigitOptions(problem.units)).current;

  useEffect(() => {
    if (chosen.h !== null && chosen.d !== null && chosen.u !== null) {
      onAnswer(chosen.h === problem.hundreds && chosen.d === problem.tens && chosen.u === problem.units);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  function select(field: Field, value: number) {
    if (result !== 'idle') return;
    setChosen((prev) => ({ ...prev, [field]: value }));
  }

  function DigitRow(
    { label, options, value, field }: { label: string; options: number[]; value: number | null; field: Field },
  ) {
    return (
      <View style={styles.decomposeRow}>
        <Text style={styles.decomposeLabel}>{label}</Text>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            testID={`decompose-digit-${field}`}
            style={[styles.digitBtn, value === opt && styles.selectedBtn]}
            onPress={() => select(field, opt)}
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
