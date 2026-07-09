import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sequenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  seqItem: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#CE93D8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  blankItem: {
    backgroundColor: '#FFF9C4',
    borderWidth: 2,
    borderColor: '#F9A825',
    borderStyle: 'dashed',
  },
  seqEmoji: { fontSize: 30 },
  blank: { fontSize: 28, fontWeight: '900', color: '#F9A825' },
});
