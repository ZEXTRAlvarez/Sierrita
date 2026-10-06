import { StyleSheet } from 'react-native';

const FACE_SIZE = 200;
const HOUR_LEN = 50;
const MINUTE_LEN = 78;

export const styles = StyleSheet.create({
  face: {
    width: FACE_SIZE,
    height: FACE_SIZE,
    borderRadius: FACE_SIZE / 2,
    borderWidth: 4,
    borderColor: '#0D47A1',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  numberLabel: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: '800',
    color: '#0D47A1',
  },
  number12: { top: 8, left: FACE_SIZE / 2 - 8 },
  number3: { top: FACE_SIZE / 2 - 10, right: 10 },
  number6: { bottom: 6, left: FACE_SIZE / 2 - 5 },
  number9: { top: FACE_SIZE / 2 - 10, left: 10 },
  handWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: FACE_SIZE,
    height: FACE_SIZE,
  },
  hourHand: {
    position: 'absolute',
    top: FACE_SIZE / 2 - HOUR_LEN,
    left: FACE_SIZE / 2 - 4,
    width: 8,
    height: HOUR_LEN,
    backgroundColor: '#0D47A1',
    borderRadius: 4,
  },
  minuteHand: {
    position: 'absolute',
    top: FACE_SIZE / 2 - MINUTE_LEN,
    left: FACE_SIZE / 2 - 3,
    width: 6,
    height: MINUTE_LEN,
    backgroundColor: '#1565C0',
    borderRadius: 3,
  },
  centerDot: {
    position: 'absolute',
    top: FACE_SIZE / 2 - 6,
    left: FACE_SIZE / 2 - 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0D47A1',
  },
});
