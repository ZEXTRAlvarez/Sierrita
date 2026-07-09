import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colorTokens } from '@sierrita/ui';

export interface ParentsHeaderProps {
  profileName?: string;
  profileAge?: number;
  onClose: () => void;
  onLock: () => void;
}

export function ParentsHeader({ profileName, profileAge, onClose, onLock }: ParentsHeaderProps) {
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} hitSlop={12}>
          <Text style={styles.headerClose}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zona de Padres</Text>
        <TouchableOpacity onPress={onLock} hitSlop={12}>
          <Text style={styles.headerLock}>🔒</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileBanner}>
        <Text style={styles.profileName}>{profileName}</Text>
        <Text style={styles.profileAge}>{profileAge} años</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 56,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colorTokens.brand700,
  },
  headerClose: { fontSize: 22, color: '#fff', fontWeight: '700' },
  headerTitle: { fontSize: 18, color: '#fff', fontWeight: '800' },
  headerLock: { fontSize: 22 },
  profileBanner: {
    backgroundColor: colorTokens.brand500,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  profileName: { fontSize: 22, fontWeight: '900', color: '#fff' },
  profileAge: { fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
});
