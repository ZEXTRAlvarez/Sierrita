import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#F3E5F5',
    minHeight: '100%',
  },
  progress: { fontSize: 16, color: '#7B1FA2', fontWeight: '600', marginBottom: 4 },
  instruction: { fontSize: 20, fontWeight: '700', color: '#4A148C', marginBottom: 12 },
  badge: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  badgeCorrect: { backgroundColor: '#7B1FA2' },
  hint: {
    marginTop: 12,
    color: '#AB47BC',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
