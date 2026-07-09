import { Text, View } from 'react-native';
import { styles } from './VisualGroup.styles';

export interface VisualGroupProps {
  count: number;
  emoji: string;
}

/** Renders `count` copies of `emoji` in a wrapped row for visual-mode comparisons. */
export function VisualGroup({ count, emoji }: VisualGroupProps) {
  return (
    <View style={styles.visualGroup}>
      {Array.from({ length: count }).map((_, i) => (
        <Text key={i} style={styles.visualEmoji}>{emoji}</Text>
      ))}
    </View>
  );
}
