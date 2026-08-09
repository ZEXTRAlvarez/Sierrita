import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { DecomposeRound } from '../../logic/buildRound';
import { styles } from './DecomposeMode.styles';

export interface DecomposeModeProps {
  round: DecomposeRound;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}

type Chosen = { h: number | null; d: number | null; u: number | null };
type Field = keyof Chosen;

const NOTHING_CHOSEN: Chosen = { h: null, d: null, u: null };

/** Shows a number and lets the child pick its hundreds, tens and units digits separately. */
export function DecomposeMode({ round, onAnswer, result }: DecomposeModeProps) {
  const { problem, options } = round;
  const [chosen, setChosen] = useState<Chosen>(NOTHING_CHOSEN);

  // A new round brings a new number, so the digits picked for the previous one
  // have to go before they are compared against it.
  const renderedRound = useRef(round);
  if (renderedRound.current !== round) {
    renderedRound.current = round;
    setChosen(NOTHING_CHOSEN);
  }

  useEffect(() => {
    if (chosen.h !== null && chosen.d !== null && chosen.u !== null) {
      onAnswer(
        chosen.h === problem.hundreds &&
          chosen.d === problem.tens &&
          chosen.u === problem.units,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  function select(field: Field, value: number) {
    if (result !== 'idle') return;
    setChosen((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <View style={styles.modeContainer}>
      <Text style={styles.bigNumber}>{problem.number}</Text>
      <Text style={styles.modeQuestion}>Descomponé el número</Text>
      <DigitRow
        label="C"
        options={options.hundreds}
        value={chosen.h}
        field="h"
        disabled={result !== 'idle'}
        onSelect={select}
      />
      <DigitRow
        label="D"
        options={options.tens}
        value={chosen.d}
        field="d"
        disabled={result !== 'idle'}
        onSelect={select}
      />
      <DigitRow
        label="U"
        options={options.units}
        value={chosen.u}
        field="u"
        disabled={result !== 'idle'}
        onSelect={select}
      />
    </View>
  );
}

interface DigitRowProps {
  label: string;
  options: number[];
  value: number | null;
  field: Field;
  disabled: boolean;
  onSelect: (field: Field, value: number) => void;
}

function DigitRow({
  label,
  options,
  value,
  field,
  disabled,
  onSelect,
}: DigitRowProps) {
  return (
    <View style={styles.decomposeRow}>
      <Text style={styles.decomposeLabel}>{label}</Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          testID={`decompose-digit-${field}`}
          style={[styles.digitBtn, value === opt && styles.selectedBtn]}
          onPress={() => onSelect(field, opt)}
          disabled={disabled}
        >
          <Text style={styles.digitText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
