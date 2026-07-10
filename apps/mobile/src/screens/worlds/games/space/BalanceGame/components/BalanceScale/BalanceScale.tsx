import { Text, View } from 'react-native';
import { styles } from './BalanceScale.styles';

export interface BalanceScaleProps {
  left: string[];
  right: string[];
}

/** Purely visual: two pans holding the round's items, with a pivot emoji between them. */
export function BalanceScale({ left, right }: BalanceScaleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pan} testID="balance-pan-left">
        {left.map((emoji, i) => (
          <Text key={i} style={styles.itemEmoji}>
            {emoji}
          </Text>
        ))}
      </View>
      <Text style={styles.pivot}>⚖️</Text>
      <View style={styles.pan} testID="balance-pan-right">
        {right.map((emoji, i) => (
          <Text key={i} style={styles.itemEmoji}>
            {emoji}
          </Text>
        ))}
      </View>
    </View>
  );
}
