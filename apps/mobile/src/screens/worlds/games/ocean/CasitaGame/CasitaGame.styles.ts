import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#FFF3E0',
  },
  progress: {
    fontSize: 16,
    color: '#EF6C00',
    fontWeight: '600',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 15,
    color: '#8D6E63',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeCorrect: { backgroundColor: '#2E7D32' },
  badgeWrong: { backgroundColor: '#F44336' },
});
