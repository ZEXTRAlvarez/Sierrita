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
  newCard: {
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    backgroundColor: '#F9FBE7',
    elevation: 2,
  },
  plusEmoji: {
    fontSize: 52,
    color: '#4CAF50',
    lineHeight: 60,
    fontWeight: '300',
  },
  newLabel: { fontSize: 14, fontWeight: '800', color: '#4CAF50' },
});
