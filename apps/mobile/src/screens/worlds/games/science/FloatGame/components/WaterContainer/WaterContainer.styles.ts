import { StyleSheet } from 'react-native';

export const CONTAINER_HEIGHT = 180;
export const WATER_HEIGHT = 110;

export const styles = StyleSheet.create({
  container: {
    width: 160,
    height: CONTAINER_HEIGHT,
    borderWidth: 3,
    borderColor: '#4E342E',
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#FFF3E0',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  item: {
    fontSize: 40,
    marginTop: 8,
  },
  water: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: WATER_HEIGHT,
    backgroundColor: 'rgba(33,150,243,0.5)',
  },
});
