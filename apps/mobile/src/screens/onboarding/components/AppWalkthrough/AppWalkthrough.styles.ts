import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    backgroundColor: '#E3F2FD',
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565C0',
  },
  stepDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  stepDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#90CAF9',
  },
  stepDotActive: { backgroundColor: '#1565C0' },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#90CAF9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 28,
    maxWidth: 340,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 6,
  },
  caption: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 21,
  },
  nextBtn: {
    backgroundColor: '#1565C0',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 3,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },
});
