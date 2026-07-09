import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wordRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  letterBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A5D6A7',
  },
  blankBox: {
    backgroundColor: '#FFF9C4',
    borderColor: '#F9A825',
    borderStyle: 'dashed',
  },
  correctBox: { backgroundColor: '#A5D6A7', borderColor: '#4CAF50' },
  wrongBox: { backgroundColor: '#FFCDD2', borderColor: '#F44336' },
  letterText: { fontSize: 26, fontWeight: '800', color: '#1B5E20' },
});
