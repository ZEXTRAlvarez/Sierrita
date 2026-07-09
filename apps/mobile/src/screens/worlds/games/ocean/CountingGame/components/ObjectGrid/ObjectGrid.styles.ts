import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, maxWidth: 320 },
  emoji: { fontSize: 30 },
  groupBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(33,150,243,0.18)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    margin: 2,
  },
  groupLabel: { fontSize: 11, color: '#1565C0', fontWeight: '800' },
});
