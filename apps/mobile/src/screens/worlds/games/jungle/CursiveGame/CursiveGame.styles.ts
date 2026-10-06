import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#FFF3E0',
  },
  progress: {
    fontSize: 16,
    color: '#FFA726',
    marginBottom: 12,
    fontWeight: '600',
  },
  badge: {
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 28,
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },
  badgeCorrect: { backgroundColor: '#2E9E44' },
  badgeWrong: { backgroundColor: '#FF7043' },
  hint: {
    marginTop: 24,
    color: '#FFCC80',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
