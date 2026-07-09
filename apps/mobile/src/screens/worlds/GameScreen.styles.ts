import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 80,
  },
  backBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  backBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
