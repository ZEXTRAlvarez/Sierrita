import { View } from 'react-native';
import type { RoundResult } from '@sierrita/games';
import { styles } from './RoundProgressDots.styles';

export interface RoundProgressDotsProps {
  roundCount: number;
  rounds: RoundResult[];
  color: string;
}

export function RoundProgressDots({
  roundCount,
  rounds,
  color,
}: RoundProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: roundCount }).map((_, i) => (
        <View
          key={i}
          testID="round-dot"
          style={[
            styles.dot,
            i < rounds.length
              ? { backgroundColor: rounds[i]?.correct ? color : '#F44336' }
              : { backgroundColor: '#DDD' },
          ]}
        />
      ))}
    </View>
  );
}
