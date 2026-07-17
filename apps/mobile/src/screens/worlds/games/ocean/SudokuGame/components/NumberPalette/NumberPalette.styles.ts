import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  numberBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  correctBtn: { backgroundColor: '#4CAF50' },
  dimBtn: { opacity: 0.4 },
  numberLabel: { fontSize: 22, fontWeight: '800', color: '#fff' },
});
