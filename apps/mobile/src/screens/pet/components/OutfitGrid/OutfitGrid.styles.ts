import { StyleSheet, Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');
const CARD_WIDTH = (W - 48 - 32) / 4;

export const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    padding: 10,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  locked: { backgroundColor: '#F5F5F5' },
  emoji: { fontSize: 32 },
  name: { fontSize: 11, fontWeight: '700', color: '#444', textAlign: 'center' },
  lockBadge: { backgroundColor: '#EEEEEE', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2 },
  lockText: { fontSize: 9, color: '#999', fontWeight: '700' },
  activeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBadgeText: { fontSize: 10, color: '#fff', fontWeight: '900' },
});
