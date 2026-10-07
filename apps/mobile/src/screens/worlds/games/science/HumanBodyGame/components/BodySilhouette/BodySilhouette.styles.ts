import { StyleSheet } from 'react-native';

export const BODY_WIDTH = 160;
export const BODY_HEIGHT = 320;
export const MARKER_SIZE = 22;

const SKIN = '#FFB74D';

export const styles = StyleSheet.create({
  container: {
    width: BODY_WIDTH,
    height: BODY_HEIGHT,
    marginBottom: 16,
  },
  head: {
    position: 'absolute',
    left: 48,
    top: 8,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: SKIN,
  },
  torso: {
    position: 'absolute',
    left: 50,
    top: 76,
    width: 60,
    height: 124,
    borderRadius: 16,
    backgroundColor: SKIN,
  },
  arm: {
    position: 'absolute',
    top: 80,
    width: 28,
    height: 100,
    borderRadius: 14,
    backgroundColor: SKIN,
  },
  armLeft: { left: 20 },
  armRight: { left: 112 },
  leg: {
    position: 'absolute',
    top: 205,
    width: 23,
    height: 105,
    borderRadius: 12,
    backgroundColor: SKIN,
  },
  legLeft: { left: 55 },
  legRight: { left: 82 },
  marker: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: '#FFEB3B',
    borderWidth: 3,
    borderColor: '#E65100',
  },
});
