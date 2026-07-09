import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 12, backgroundColor: '#E3F2FD' },
  progress: { fontSize: 16, color: '#1976D2', fontWeight: '600', marginBottom: 8 },
  badge: {
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  badgeCorrect: { backgroundColor: '#1565C0' },
  badgeWrong: { backgroundColor: '#F44336' },
});
