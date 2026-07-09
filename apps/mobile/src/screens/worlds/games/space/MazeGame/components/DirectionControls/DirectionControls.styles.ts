import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  controls: {
    gap: 4,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dirBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7B1FA2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  dirBtnDisabled: {
    backgroundColor: '#4A148C',
    opacity: 0.45,
  },
  dirCenter: { width: 72, height: 72 },
  dirText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 36,
  },
});
