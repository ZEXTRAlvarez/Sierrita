import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  dots: { flexDirection: 'row', gap: 10, marginTop: 24 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DDD' },
  dotActive: { backgroundColor: '#4CAF50', width: 24 },
});
