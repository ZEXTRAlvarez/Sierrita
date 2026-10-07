import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#CE93D8',
    marginBottom: 20,
  },
  row: { flexDirection: 'row' },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareLight: { backgroundColor: '#F3E5F5' },
  squareDark: { backgroundColor: '#7E57C2' },
  squareSelected: { backgroundColor: '#FFD54F' },
  squareCorrect: { backgroundColor: '#4CAF50' },
  squareMissed: { backgroundColor: '#FFB74D' },
  squareWrong: { backgroundColor: '#F44336' },
});
