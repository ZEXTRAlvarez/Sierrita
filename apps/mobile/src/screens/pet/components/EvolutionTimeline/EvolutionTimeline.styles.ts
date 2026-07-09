import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  timeline: { gap: 0 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, position: 'relative' },
  dot: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  dotCurrent: {
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dotEmoji: { fontSize: 20 },
  line: { position: 'absolute', left: 21, top: 44, width: 3, height: 24, borderRadius: 2, zIndex: 0 },
  info: { flex: 1, paddingTop: 10, paddingBottom: 20 },
  label: { fontSize: 15, fontWeight: '700', color: '#444' },
  xp: { fontSize: 12, color: '#AAA', fontWeight: '600', marginTop: 2 },
});
