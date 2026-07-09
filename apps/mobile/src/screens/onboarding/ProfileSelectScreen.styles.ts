import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    paddingBottom: 48,
  },
  hint: {
    textAlign: 'center',
    color: '#7CB342',
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 16,
  },
});
