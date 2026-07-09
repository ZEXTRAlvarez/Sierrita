import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#F3E5F5',
  },
  progress: {
    fontSize: 16,
    color: '#7B1FA2',
    fontWeight: '600',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4A148C',
    marginBottom: 16,
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
  badgeCorrect: { backgroundColor: '#7B1FA2' },
  badgeWrong: { backgroundColor: '#F44336' },
});
