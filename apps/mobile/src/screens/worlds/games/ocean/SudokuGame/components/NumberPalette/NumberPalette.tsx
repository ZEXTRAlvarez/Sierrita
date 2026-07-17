import { Text, TouchableOpacity, View } from 'react-native';
import type { RoundResult } from '../../../../shared/useGameRound';
import { styles } from './NumberPalette.styles';

export interface NumberPaletteProps {
  size: number;
  answer: number | null;
  result: RoundResult;
  onChoose: (num: number) => void;
}

/** Buttons 1..size; highlights the correct answer and dims the rest once answered. */
export function NumberPalette({
  size,
  answer,
  result,
  onChoose,
}: NumberPaletteProps) {
  const numbers = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <View style={styles.row}>
      {numbers.map((num) => (
        <TouchableOpacity
          key={num}
          testID="sudoku-number-choice"
          style={[
            styles.numberBtn,
            result !== 'idle' && num === answer && styles.correctBtn,
            result === 'wrong' && num !== answer && styles.dimBtn,
          ]}
          onPress={() => onChoose(num)}
          disabled={result !== 'idle'}
        >
          <Text style={styles.numberLabel}>{num}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
