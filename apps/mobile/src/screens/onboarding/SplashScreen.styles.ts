import { StyleSheet, Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  circleOuter: {
    position: 'absolute',
    width: W * 1.4,
    height: W * 1.4,
    borderRadius: W * 0.7,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -W * 0.3,
  },
  circleInner: {
    position: 'absolute',
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W * 0.45,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -W * 0.05,
  },
  content: { alignItems: 'center' },
  logo: { fontSize: 108, marginBottom: 0 },
  titleBlock: { alignItems: 'center', marginTop: 8 },
  title: {
    fontSize: 58,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    color: '#A5D6A7',
    marginTop: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    bottom: 60,
  },
});
