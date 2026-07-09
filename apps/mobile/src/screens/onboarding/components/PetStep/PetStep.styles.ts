import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: 28 },
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 24 },
  petOption: {
    width: 100, height: 110, borderRadius: 20,
    borderWidth: 3, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center',
  },
  petOptionSelected: { borderColor: '#FF7043', backgroundColor: '#FFF3E0' },
  petEmoji: { fontSize: 40 },
  petLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginTop: 4 },
  btn: {
    backgroundColor: '#4CAF50', borderRadius: 20,
    paddingHorizontal: 40, paddingVertical: 16, minWidth: 160, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#BDBDBD' },
  btnText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
});
