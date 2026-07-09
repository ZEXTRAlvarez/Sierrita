import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#F3E5F5',
  },
  progress: { fontSize: 16, color: '#7B1FA2', fontWeight: '600', marginBottom: 4 },
  instruction: { fontSize: 20, fontWeight: '700', color: '#4A148C', marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
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
  badgeFinished: { backgroundColor: '#7B1FA2' },
});
