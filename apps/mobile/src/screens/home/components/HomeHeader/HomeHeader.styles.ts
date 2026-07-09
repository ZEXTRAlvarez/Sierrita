import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'android' ? 40 : 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#2E7D32',
  },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  greeting: { fontSize: 24, fontWeight: '900', color: '#fff' },
  subgreeting: {
    fontSize: 14,
    color: '#A5D6A7',
    fontWeight: '600',
    marginTop: 2,
  },
  parentBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
