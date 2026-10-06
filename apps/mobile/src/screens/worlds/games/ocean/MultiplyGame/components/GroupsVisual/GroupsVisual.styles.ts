import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  groupsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 16,
    maxWidth: 320,
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    maxWidth: 90,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1565C0' },
});
