import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  emoji: { fontSize: 72, marginBottom: 12 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 28,
  },
  ageRow: { flexDirection: 'row', gap: 16, marginBottom: 28 },
  agePill: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agePillSelected: { backgroundColor: '#4CAF50' },
  ageText: { fontSize: 32, fontWeight: '800', color: '#4CAF50' },
  ageTextSelected: { color: '#FFF' },
  btn: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 16,
    minWidth: 160,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#BDBDBD' },
  btnText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
});
