import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
// 3 botones por fila: ancho de pantalla menos el padding horizontal del scroll (20*2) y los 2 gaps entre tarjetas (12*2)
const ACTION_BTN_W = (SCREEN_W - 40 - 24) / 3;

export const styles = StyleSheet.create({
  shadow: {
    width: ACTION_BTN_W,
    borderRadius: 20,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  wrap: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  btn: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  iconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
  },
});
