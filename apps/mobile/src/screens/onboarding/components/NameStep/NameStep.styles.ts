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
  input: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderRadius: 16,
    padding: 16,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#222',
  },
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
