import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
  },
  back: { fontSize: 22, color: '#FFF', fontWeight: '700' },
  title: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  level: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
});
