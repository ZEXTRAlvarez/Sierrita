import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#1A0A2E',
  },
  instruction: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E1BEE7',
    marginBottom: 16,
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
  badgeFinished: { backgroundColor: '#7B1FA2' },
});
