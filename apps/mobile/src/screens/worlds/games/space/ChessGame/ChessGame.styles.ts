import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#1A0E33',
  },
  progress: {
    fontSize: 16,
    color: '#CE93D8',
    fontWeight: '600',
    marginBottom: 8,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  confirmBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  confirmText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  badge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeCorrect: { backgroundColor: '#4CAF50' },
  badgeWrong: { backgroundColor: '#F44336' },
});
