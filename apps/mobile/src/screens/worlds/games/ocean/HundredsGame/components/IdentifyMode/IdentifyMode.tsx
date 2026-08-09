import { Text, TouchableOpacity, View } from 'react-native';
import { DIGIT_LABELS, type IdentifyRound } from '../../logic/buildRound';
import { styles } from './IdentifyMode.styles';

export interface IdentifyModeProps {
  round: IdentifyRound;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}

/** Shows a number and asks how many hundreds/tens/units it has. */
export function IdentifyMode({ round, onAnswer, result }: IdentifyModeProps) {
  const { problem, field, answer, options } = round;

  return (
    <View style={styles.modeContainer}>
      <Text testID="identify-number" style={styles.bigNumber}>
        {problem.number}
      </Text>
      <Text testID="identify-question" style={styles.modeQuestion}>
        {`¿Cuántas ${DIGIT_LABELS[field]} tiene?`}
      </Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            testID="identify-option"
            style={[
              styles.optionBtn,
              result !== 'idle' && opt === answer && styles.correctBtn,
              result === 'wrong' && opt !== answer && styles.dimBtn,
            ]}
            onPress={() => onAnswer(opt === answer)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
