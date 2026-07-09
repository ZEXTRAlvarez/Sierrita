import { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { rand } from '../../../../shared/rand';
import { generateDigitOptions } from '../../logic/generateDigitOptions';
import type { Problem } from '../../logic/generateProblem';
import { styles } from './IdentifyMode.styles';

export interface IdentifyModeProps {
  problem: Problem;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}

type DigitField = 'hundreds' | 'tens' | 'units';

const LABELS: Record<DigitField, string> = {
  hundreds: 'centenas',
  tens: 'decenas',
  units: 'unidades',
};

/** Shows a number and asks how many hundreds/tens/units it has. */
export function IdentifyMode({ problem, onAnswer, result }: IdentifyModeProps) {
  // Solo preguntamos por centenas cuando el número realmente puede tenerlas;
  // si no, la respuesta sería siempre 0 sin importar el número mostrado.
  const questionType = useRef<DigitField>(
    (() => {
      const types: DigitField[] =
        problem.number >= 100
          ? ['hundreds', 'tens', 'units']
          : ['tens', 'units'];
      return types[rand(0, types.length - 1)];
    })(),
  ).current;

  const correctValue = problem[questionType];
  const options = useRef(generateDigitOptions(correctValue)).current;

  return (
    <View style={styles.modeContainer}>
      <Text style={styles.bigNumber}>{problem.number}</Text>
      <Text style={styles.modeQuestion}>
        ¿Cuántas {LABELS[questionType]} tiene?
      </Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            testID="identify-option"
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
