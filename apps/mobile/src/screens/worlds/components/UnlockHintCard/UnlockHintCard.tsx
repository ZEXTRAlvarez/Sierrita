import { Text, View } from 'react-native';
import { styles } from './UnlockHintCard.styles';

export function UnlockHintCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>🔒 Los juegos con candado se desbloquean a medida que crecés</Text>
    </View>
  );
}
