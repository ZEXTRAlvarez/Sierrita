import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#F1F8E9',
  },
  letterLabel: {
    fontSize: 72,
    fontWeight: '900',
    color: '#2E7D32',
    lineHeight: 80,
    marginBottom: 4,
  },
  progress: {
    fontSize: 16,
    color: '#66BB6A',
    marginBottom: 12,
    fontWeight: '600',
  },
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
  badgeWrong: { backgroundColor: '#F44336' },
  hint: {
    marginTop: 24,
    color: '#A5D6A7',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
