import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    gap: 6,
    overflow: 'hidden',
  },
  cardStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  petStage: { alignItems: 'center', justifyContent: 'center' },
  petGlow: { position: 'absolute' },
  name: { fontSize: 17, fontWeight: '900', color: '#222', textAlign: 'center' },
  agePill: {
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  ageText: { fontSize: 13, fontWeight: '800' },
});
