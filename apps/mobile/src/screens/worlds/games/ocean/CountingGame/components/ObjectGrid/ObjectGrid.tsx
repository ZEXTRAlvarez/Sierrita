import { Text, View } from 'react-native';
import { styles } from './ObjectGrid.styles';

export interface ObjectGridProps {
  count: number;
  emoji: string;
}

/** Renders `count` emoji; above 20 it groups them in tens so large counts stay readable. */
export function ObjectGrid({ count, emoji }: ObjectGridProps) {
  if (count <= 20) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: count }).map((_, i) => (
          <Text key={i} style={styles.emoji}>{emoji}</Text>
        ))}
      </View>
    );
  }

  const tens = Math.floor(count / 10);
  const units = count % 10;
  return (
    <View style={styles.grid}>
      {Array.from({ length: tens }).map((_, i) => (
        <View key={`t${i}`} style={styles.groupBox}>
          <Text style={styles.groupLabel}>10</Text>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      ))}
      {Array.from({ length: units }).map((_, i) => (
        <Text key={`u${i}`} style={styles.emoji}>{emoji}</Text>
      ))}
    </View>
  );
}
