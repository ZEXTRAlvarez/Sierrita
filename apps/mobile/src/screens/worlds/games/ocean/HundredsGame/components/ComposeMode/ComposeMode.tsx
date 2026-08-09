import { Text, TouchableOpacity, View } from 'react-native';
import type { ComposeRound } from '../../logic/buildRound';
import { styles } from './ComposeMode.styles';

export interface ComposeModeProps {
  round: ComposeRound;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}

/** Shows H + D + U and lets the child pick the number they compose. */
export function ComposeMode({ round, onAnswer, result }: ComposeModeProps) {
  const { problem, options } = round;

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
