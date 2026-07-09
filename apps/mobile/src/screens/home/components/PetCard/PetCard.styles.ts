import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  cardImage: { borderRadius: 24 },
  left: { alignItems: 'center', justifyContent: 'center', width: 92 },
  glow: { position: 'absolute', width: 80, height: 80, borderRadius: 40 },
  right: { flex: 1, gap: 6 },
  moodBubble: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 14,
    borderLeftWidth: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  moodText: { fontSize: 13, fontWeight: '700', color: '#4E342E' },
  needsRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  xpRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  xpLabel: { fontSize: 11, fontWeight: '700', color: '#888', minWidth: 56 },
  xpTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', borderRadius: 4, backgroundColor: '#FFC107' },
  xpAmount: { fontSize: 11, fontWeight: '700', color: '#FFA000' },
});
