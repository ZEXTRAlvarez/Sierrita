import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  grid: {
    borderWidth: 2,
    borderColor: '#1565C0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#BBDEFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thickRight: {
    borderRightWidth: 2,
    borderRightColor: '#1565C0',
  },
  thickBottom: {
    borderBottomWidth: 2,
    borderBottomColor: '#1565C0',
  },
  currentCell: {
    backgroundColor: '#FFF176',
  },
  filledCell: {
    backgroundColor: '#E8F5E9',
  },
  value: {
    fontWeight: '800',
    color: '#0D47A1',
  },
  filledValue: {
    color: '#2E7D32',
  },
});
