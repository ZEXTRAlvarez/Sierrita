import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  pan: {
    width: 130,
    minHeight: 110,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#CE93D8',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 8,
  },
  itemEmoji: { fontSize: 28 },
  pivot: {
    fontSize: 30,
    marginBottom: 30,
  },
});
