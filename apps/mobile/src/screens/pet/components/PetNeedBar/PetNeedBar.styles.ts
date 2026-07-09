import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  labelWrap: { width: 84, flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 13, fontWeight: '700', color: '#5D4037' },
  track: {
    flex: 1,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 7,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 7 },
  pct: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8D6E63',
    width: 28,
    textAlign: 'right',
  },
});
