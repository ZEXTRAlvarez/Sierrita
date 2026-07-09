import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProfileHeader.styles';

export interface ProfileHeaderProps {
  isSwitching: boolean;
  onBack: () => void;
}

export function ProfileHeader({ isSwitching, onBack }: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      {isSwitching && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={12}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>¿Quién juega hoy?</Text>
      <Text style={styles.subtitle}>
        {isSwitching ? 'Elegí un perfil o creá uno nuevo' : 'Tocá tu perfil para entrar'}
      </Text>
    </View>
  );
}
