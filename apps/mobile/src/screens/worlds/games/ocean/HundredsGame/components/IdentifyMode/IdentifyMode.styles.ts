import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modeContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  bigNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: '#0D47A1',
    lineHeight: 92,
    marginBottom: 4,
  },
  modeQuestion: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },
  optionBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  correctBtn: { backgroundColor: '#4CAF50' },
  dimBtn: { opacity: 0.4 },
  optionText: { fontSize: 24, fontWeight: '900', color: '#fff' },
});
