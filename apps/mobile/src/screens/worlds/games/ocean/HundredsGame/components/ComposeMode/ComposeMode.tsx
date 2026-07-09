import { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { generateNumOptions } from '../../logic/generateNumOptions';
import type { Problem } from '../../logic/generateProblem';
import { styles } from './ComposeMode.styles';

export interface ComposeModeProps {
  problem: Problem;
  maxNumber: number;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}

/** Shows H + D + U and lets the child pick the number they compose. */
export function ComposeMode({
  problem,
  maxNumber,
  onAnswer,
  result,
}: ComposeModeProps) {
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
            testID="compose-option"
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
