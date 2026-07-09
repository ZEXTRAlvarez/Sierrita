import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 56,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  backBtnText: { fontSize: 15, fontWeight: '800', color: '#2E7D32' },
  title: {
    fontSize: 30, fontWeight: '900', color: '#2E7D32',
  },
  subtitle: {
    fontSize: 14, color: '#5D4037', fontWeight: '600', marginTop: 4,
  },
});
