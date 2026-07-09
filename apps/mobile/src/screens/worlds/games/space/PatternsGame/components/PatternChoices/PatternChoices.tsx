import { Text, TouchableOpacity, View } from 'react-native';
import type { RoundResult } from '../../../../shared/useGameRound';
import { styles } from './PatternChoices.styles';

export interface PatternChoicesProps {
  choices: string[];
  answer: string;
  result: RoundResult;
  onChoose: (choice: string) => void;
}

/** Answer-choice buttons row; highlights the correct one and dims the rest once answered. */
export function PatternChoices({ choices, answer, result, onChoose }: PatternChoicesProps) {
  return (
    <View style={styles.choicesRow}>
      {choices.map((ch, i) => (
        <TouchableOpacity
          key={i}
          testID="pattern-choice"
          style={[
            styles.choiceBtn,
            result !== 'idle' && ch === answer && styles.correctBtn,
            result === 'wrong' && ch !== answer && styles.dimBtn,
          ]}
          onPress={() => onChoose(ch)}
          disabled={result !== 'idle'}
        >
          <Text style={styles.choiceEmoji}>{ch}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
