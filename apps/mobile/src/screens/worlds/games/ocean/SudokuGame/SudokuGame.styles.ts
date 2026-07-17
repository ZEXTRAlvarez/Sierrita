import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#E3F2FD',
  },
  progress: {
    fontSize: 16,
    color: '#1565C0',
    fontWeight: '600',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D47A1',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  badge: {
    marginTop: 20,
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
