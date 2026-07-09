import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modeContainer: { flex: 1, alignItems: 'center', width: '100%', paddingHorizontal: 16 },
  bigNumber: { fontSize: 80, fontWeight: '900', color: '#0D47A1', lineHeight: 92, marginBottom: 4 },
  modeQuestion: { fontSize: 20, fontWeight: '700', color: '#1565C0', marginBottom: 20, textAlign: 'center' },
  decomposeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  decomposeLabel: { fontSize: 20, fontWeight: '900', color: '#0D47A1', width: 28 },
  digitBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#90CAF9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#42A5F5',
  },
  selectedBtn: { backgroundColor: '#1565C0', borderColor: '#0D47A1' },
  digitText: { fontSize: 20, fontWeight: '900', color: '#fff' },
});
