import { View, Text, TouchableOpacity } from 'react-native';
import { IconAnimation } from '../../../../components/IconAnimation';
import { styles } from './HomeHeader.styles';

export interface HomeHeaderProps {
  profileName?: string;
  onOpenParents: () => void;
}

export function HomeHeader({ profileName, onOpenParents }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>¡Hola, {profileName ?? 'amigo'}!</Text>
          <IconAnimation name="mano" size={52} />
        </View>
        <Text style={styles.subgreeting}>¿Qué aprendemos hoy?</Text>
      </View>
      <TouchableOpacity
        style={styles.parentBtn}
        onPress={onOpenParents}
        hitSlop={12}
        testID="home-header-parent-btn"
      >
        <IconAnimation name="engranaje" size={52} />
      </TouchableOpacity>
    </View>
  );
}
