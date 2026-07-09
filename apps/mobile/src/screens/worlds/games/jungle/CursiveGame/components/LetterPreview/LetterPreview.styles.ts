import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  letterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  letterCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    minWidth: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  labelSmall: {
    fontSize: 12,
    color: '#FF8F00',
    fontWeight: '600',
    marginBottom: 2,
  },
  letterPrint: {
    fontSize: 52,
    fontWeight: '900',
    color: '#E65100',
    lineHeight: 58,
  },
  letterCursive: {
    fontSize: 52,
    fontStyle: 'italic',
    color: '#F4511E',
    lineHeight: 58,
  },
  arrow: { fontSize: 28, color: '#FFCC02', fontWeight: '900' },
});
