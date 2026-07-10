import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  choicesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  choiceBtn: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    minWidth: 96,
  },
  correctBtn: { backgroundColor: '#4CAF50' },
  dimBtn: { opacity: 0.4 },
  choiceLabel: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
