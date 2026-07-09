import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 16, backgroundColor: '#F1F8E9' },
  emoji: { fontSize: 64, marginBottom: 4 },
  progress: { fontSize: 16, color: '#66BB6A', fontWeight: '600', marginBottom: 8 },
  instruction: { fontSize: 18, color: '#388E3C', fontWeight: '700', marginBottom: 16 },
  badge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  badgeCorrect: { backgroundColor: '#4CAF50' },
  badgeWrong: { backgroundColor: '#F44336' },
});
