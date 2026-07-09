import { View, Text } from 'react-native';
import type { Operation } from '../../logic/generateProblem';
import { styles } from './VisualBlocks.styles';

export interface VisualBlocksProps {
  a: number;
  b: number;
  op: Operation;
}

/** Renders block counters for a & b when both operands are small enough to visualize (<=10). */
export function VisualBlocks({ a, b, op }: VisualBlocksProps) {
  if (a > 10 || b > 10) return null;
  return (
    <View style={styles.visualRow}>
      <View style={styles.blockGroup}>
        {Array.from({ length: a }).map((_, i) => (
          <View
            key={i}
            testID="block-a"
            style={[styles.block, { backgroundColor: '#1565C0' }]}
          />
        ))}
      </View>
      <Text style={styles.opSymbol}>{op === 'add' ? '+' : '−'}</Text>
      <View style={styles.blockGroup}>
        {Array.from({ length: b }).map((_, i) => (
          <View
            key={i}
            testID="block-b"
            style={[
              styles.block,
              { backgroundColor: op === 'add' ? '#0288D1' : '#F44336' },
            ]}
          />
        ))}
      </View>
    </View>
  );
}
