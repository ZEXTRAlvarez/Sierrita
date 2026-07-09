import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 12, backgroundColor: '#FFF3E0' },
  progress: { fontSize: 16, color: '#FFA726', marginBottom: 12, fontWeight: '600' },
  badge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  badgeCorrect: { backgroundColor: '#4CAF50' },
  badgeWrong: { backgroundColor: '#FF7043' },
  hint: { marginTop: 24, color: '#FFCC80', fontSize: 14, textDecorationLine: 'underline' },
});
