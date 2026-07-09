import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  icon: { fontSize: 24 },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '600',
    lineHeight: 20,
  },
});
