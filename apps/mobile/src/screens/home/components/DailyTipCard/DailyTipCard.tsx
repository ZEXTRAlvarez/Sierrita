import { Text, View } from 'react-native';
import { styles } from './DailyTipCard.styles';

export interface DailyTipCardProps {
  tip: string;
}

export function DailyTipCard({ tip }: DailyTipCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>💡</Text>
      <Text style={styles.text}>{tip}</Text>
    </View>
  );
}
