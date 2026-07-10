import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  itemBtn: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#CE93D8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  correctBtn: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  dimBtn: { opacity: 0.4 },
  itemEmoji: { fontSize: 36 },
});
