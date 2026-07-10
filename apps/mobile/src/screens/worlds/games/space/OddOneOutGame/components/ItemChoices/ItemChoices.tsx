import { Text, TouchableOpacity, View } from 'react-native';
import type { RoundResult } from '../../../../shared/useGameRound';
import { styles } from './ItemChoices.styles';

export interface ItemChoicesProps {
  items: string[];
  intruder: string;
  result: RoundResult;
  onChoose: (item: string) => void;
}

/** Grid of tappable items; highlights the intruder and dims the rest once answered. */
export function ItemChoices({
  items,
  intruder,
  result,
  onChoose,
}: ItemChoicesProps) {
  return (
    <View style={styles.grid}>
      {items.map((item, i) => (
        <TouchableOpacity
          key={i}
          testID="odd-one-out-choice"
          style={[
            styles.itemBtn,
            result !== 'idle' && item === intruder && styles.correctBtn,
            result === 'wrong' && item !== intruder && styles.dimBtn,
          ]}
          onPress={() => onChoose(item)}
          disabled={result !== 'idle'}
        >
          <Text style={styles.itemEmoji}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
