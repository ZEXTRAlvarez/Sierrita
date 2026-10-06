import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 56,
    width: 260,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  segment: {
    flex: 1,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#0D47A1',
  },
  segmentFilled: { backgroundColor: '#FF9800' },
});
