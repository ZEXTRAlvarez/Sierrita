import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#333' },
  subtitle: { fontSize: 12, color: '#AAA', fontWeight: '600', marginTop: -6 },
});
