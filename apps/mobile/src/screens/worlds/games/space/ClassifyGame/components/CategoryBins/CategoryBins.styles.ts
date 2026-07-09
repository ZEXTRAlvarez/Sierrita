import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  binsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  bin: {
    minWidth: 130,
    minHeight: 100,
    backgroundColor: '#EDE7F6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CE93D8',
    padding: 10,
    alignItems: 'center',
  },
  binActive: {
    borderColor: '#9C27B0',
    borderStyle: 'dashed',
    backgroundColor: '#E1BEE7',
  },
  binLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A148C',
    marginBottom: 6,
    textAlign: 'center',
  },
  binItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  binItemEmoji: { fontSize: 22 },
});
