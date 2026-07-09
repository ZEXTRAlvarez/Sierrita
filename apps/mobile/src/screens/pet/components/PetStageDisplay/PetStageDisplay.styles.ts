import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  center: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 95,
    opacity: 0.5,
  },
  moodPill: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    maxWidth: '90%',
  },
  moodPillText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5D4037',
    textAlign: 'center',
  },
});
