import { StyleSheet } from 'react-native';

// Shared between the styles below and Casita.tsx's outer operator spacer,
// which must match the roof height + body top padding exactly to line up
// with the second (b) digit row.
export const ROOF_HEIGHT = 56;
export const BODY_PADDING_TOP = 16;

export const styles = StyleSheet.create({
  houseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  opColumn: {
    alignItems: 'center',
    paddingTop: ROOF_HEIGHT + BODY_PADDING_TOP,
    marginRight: 6,
  },
  outerOpSymbol: {
    fontSize: 28,
    fontWeight: '900',
    color: '#5D4037',
  },
  house: {
    alignItems: 'center',
  },
  roof: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderBottomWidth: ROOF_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EF6C00',
  },
  body: {
    backgroundColor: '#FFF8E1',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingTop: BODY_PADDING_TOP,
    paddingBottom: 20,
    paddingHorizontal: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    width: 82,
    alignItems: 'center',
  },
  divider: {
    width: 2,
    alignSelf: 'stretch',
    backgroundColor: '#EF6C00',
    marginHorizontal: 6,
  },
  colLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F57C00',
    marginBottom: 4,
  },
  digit: {
    fontSize: 30,
    fontWeight: '900',
    color: '#5D4037',
  },
  aDigitWrap: {
    position: 'relative',
  },
  struckDigit: {
    color: '#C62828',
  },
  // `textDecorationLine: 'line-through'` renders too thin/faint on most
  // devices to notice at a glance — draw the strike as an explicit bar instead.
  strikeLine: {
    position: 'absolute',
    left: -4,
    right: -4,
    top: '46%',
    height: 4,
    backgroundColor: '#C62828',
    borderRadius: 2,
    transform: [{ rotate: '-8deg' }],
  },
  borrowCorrection: {
    position: 'absolute',
    top: -18,
    right: -36,
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  carryCorrection: {
    position: 'absolute',
    top: -14,
    right: -30,
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#D84315',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  line: {
    height: 3,
    alignSelf: 'stretch',
    backgroundColor: '#5D4037',
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 2,
  },
  answerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  digitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFCC80',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FB8C00',
  },
  selectedBtn: { backgroundColor: '#EF6C00', borderColor: '#E65100' },
  digitBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
  lockedHint: { fontSize: 20, marginTop: 4 },
  regroupBadge: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#D84315',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
