import { Text, TouchableOpacity, View } from 'react-native';
import type { RoundResult } from '../../../../shared/useGameRound';
import type { BalanceAnswer } from '../../logic/generateRound';
import { styles } from './BalanceChoices.styles';

export interface BalanceChoicesProps {
  answer: BalanceAnswer;
  result: RoundResult;
  onChoose: (choice: BalanceAnswer) => void;
}

const OPTIONS: { value: BalanceAnswer; label: string }[] = [
  { value: 'left', label: '◀ Izquierda' },
  { value: 'equal', label: '= Iguales' },
  { value: 'right', label: 'Derecha ▶' },
];

/** The three fixed balance answers; highlights the correct one and dims the rest once answered. */
export function BalanceChoices({
  answer,
  result,
  onChoose,
}: BalanceChoicesProps) {
  return (
    <View style={styles.choicesRow}>
      {OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          testID="balance-choice"
          style={[
            styles.choiceBtn,
            result !== 'idle' && opt.value === answer && styles.correctBtn,
            result === 'wrong' && opt.value !== answer && styles.dimBtn,
          ]}
          onPress={() => onChoose(opt.value)}
          disabled={result !== 'idle'}
        >
          <Text style={styles.choiceLabel}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
