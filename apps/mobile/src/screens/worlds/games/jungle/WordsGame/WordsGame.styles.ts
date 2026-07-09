import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#F1F8E9',
  },
  emoji: { fontSize: 72, marginBottom: 4 },
  progress: {
    fontSize: 16,
    color: '#66BB6A',
    marginBottom: 16,
    fontWeight: '600',
  },
  eraseBtn: {
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  eraseText: { fontSize: 15, color: '#388E3C', fontWeight: '600' },
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
