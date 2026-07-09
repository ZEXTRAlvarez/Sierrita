import { StyleSheet } from 'react-native';
import { colorTokens } from '@sierrita/ui';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: { backgroundColor: '#fff', borderRadius: 24, padding: 28, width: '100%', maxWidth: 360, elevation: 10 },
  title: { fontSize: 20, fontWeight: '800', color: '#4A148C', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 10, textAlign: 'center' },
  input: {
    borderWidth: 2,
    borderColor: '#9C27B0',
    borderRadius: 14,
    padding: 14,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 10,
  },
  error: { color: colorTokens.error, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  cancelBtn: { flex: 1, backgroundColor: '#EEE', borderRadius: 14, padding: 14, alignItems: 'center' },
  saveBtn: { flex: 1, backgroundColor: '#7B1FA2', borderRadius: 14, padding: 14, alignItems: 'center' },
  cancelText: { fontSize: 16, fontWeight: '700', color: '#555' },
  saveText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
