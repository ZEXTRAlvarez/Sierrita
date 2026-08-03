import { StyleSheet } from 'react-native';

// Both boxes share paddings, border width and gap so a stick occupies the exact
// same grid slot in either one: rows stay aligned as sticks move between them.
const area = {
  minHeight: 70,
  marginHorizontal: 16,
  borderRadius: 14,
  borderWidth: 2,
  padding: 8,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  gap: 8,
} as const;

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
  },
  countArea: {
    ...area,
    borderColor: '#81C784',
    borderStyle: 'dashed',
    backgroundColor: '#F1F8E9',
  },
  tray: {
    ...area,
    marginTop: 10,
    borderColor: 'transparent',
    backgroundColor: '#EFEBE9',
  },
  areaHint: {
    fontSize: 13,
    color: '#558B2F',
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },
  trayHint: {
    color: '#8D6E63',
  },
  bundleBadge: {
    alignSelf: 'center',
    marginTop: 6,
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  palitoWrap: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  palitoTouchArea: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  palito: {
    width: 8,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#A1887F',
  },
  palitoDropped: {
    backgroundColor: '#33691E',
  },
});
