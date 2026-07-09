import { Dimensions, StyleSheet } from 'react-native';

const { width: W } = Dimensions.get('window');
const IS_TABLET = W >= 600;
const CARD_W = IS_TABLET ? (W - 64) / 2 : (W - 52) / 2;

export const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    position: 'relative',
  },
  cardLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#DDD',
    borderStyle: 'dashed',
  },
  emoji: { fontSize: 32 },
  emojiLocked: { opacity: 0.4 },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    lineHeight: 17,
  },
  nameLocked: { color: '#BBB' },
  lockBadge: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  lockText: { fontSize: 11, fontWeight: '700', color: '#999' },
});
