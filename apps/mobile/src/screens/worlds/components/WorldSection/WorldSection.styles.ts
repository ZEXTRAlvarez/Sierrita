import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  headerText: { flex: 1 },
  name: { fontSize: 20, fontWeight: '900', color: '#fff' },
  subject: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginTop: 2,
  },
  progressBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  progressText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  progressTrack: { height: 4, width: '100%' },
  progressFill: { height: '100%' },
  gameGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10 },
});
