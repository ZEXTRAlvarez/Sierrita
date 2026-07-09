import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  stage: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 4 },
});
