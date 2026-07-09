import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tray: {
    minHeight: 64,
    width: '90%',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#A5D6A7',
    borderStyle: 'dashed',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
    gap: 8,
    marginBottom: 20,
  },
  trayPlaceholder: { color: '#A5D6A7', fontSize: 14, fontStyle: 'italic' },
  wordChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  correctChip: { backgroundColor: '#2E7D32' },
  wrongChip: { backgroundColor: '#F44336' },
  wordText: { fontSize: 18, fontWeight: '800', color: '#fff' },
});
