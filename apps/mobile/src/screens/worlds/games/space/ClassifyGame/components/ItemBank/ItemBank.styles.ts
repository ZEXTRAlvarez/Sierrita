import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  itemBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    minHeight: 60,
  },
  itemChip: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CE93D8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  itemSelected: {
    backgroundColor: '#9C27B0',
    borderWidth: 3,
    borderColor: '#FFF9C4',
    transform: [{ scale: 1.12 }],
  },
  itemEmoji: { fontSize: 28 },
});
