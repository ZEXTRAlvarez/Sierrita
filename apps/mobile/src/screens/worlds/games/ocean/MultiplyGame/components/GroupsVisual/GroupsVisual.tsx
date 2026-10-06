import { View } from 'react-native';
import type { Operation } from '../../logic/generateProblem';
import { styles } from './GroupsVisual.styles';

export interface GroupsVisualProps {
  op: Operation;
  a: number;
  b: number;
}

/**
 * Visualizes multiplication as `a` groups of `b` dots (a repeated-sum array),
 * or division as the dividend `a` split into `b` equal groups of `a / b` dots.
 */
export function GroupsVisual({ op, a, b }: GroupsVisualProps) {
  const groupCount = op === 'multiply' ? a : b;
  const itemsPerGroup = op === 'multiply' ? b : a / b;

  if (groupCount > 10 || itemsPerGroup > 10) return null;

  return (
    <View style={styles.groupsRow}>
      {Array.from({ length: groupCount }).map((_, g) => (
        <View key={g} testID="visual-group" style={styles.group}>
          {Array.from({ length: itemsPerGroup }).map((_, i) => (
            <View key={i} testID="visual-dot" style={styles.dot} />
          ))}
        </View>
      ))}
    </View>
  );
}
