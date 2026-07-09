import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  visualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  blockGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    maxWidth: 120,
    justifyContent: 'center',
  },
  block: { width: 18, height: 18, borderRadius: 4 },
  opSymbol: { fontSize: 32, fontWeight: '900', color: '#1565C0' },
});
