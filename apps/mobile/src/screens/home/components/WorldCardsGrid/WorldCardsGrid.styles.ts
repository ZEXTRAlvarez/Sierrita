import { Dimensions, StyleSheet } from 'react-native';

const { width: W } = Dimensions.get('window');
export const IS_TABLET = W >= 600;

export const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridTablet: { justifyContent: 'space-between' },
  card: {
    width: IS_TABLET ? (W - 64) / 3 : (W - 44) / 3,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    gap: 4,
  },
  cardTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  cardName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 16,
  },
  cardSubject: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  cardBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  cardBadgeText: { fontSize: 10, fontWeight: '800' },
});
