import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  stage: { fontSize: 17, fontWeight: '800', color: '#4E342E' },
  xpBadge: {
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  xpBadgeText: { fontSize: 13, fontWeight: '800', color: '#F9A825' },
  xpBarRow: { marginBottom: 16, gap: 6 },
  xpTrack: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', borderRadius: 5, backgroundColor: '#FFCA28' },
  xpBarLabel: { fontSize: 12, color: '#6D4C41', fontWeight: '600' },
  needsGrid: { gap: 10 },
});
