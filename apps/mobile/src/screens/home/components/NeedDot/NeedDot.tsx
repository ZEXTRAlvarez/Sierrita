import { View, StyleSheet } from 'react-native';

export interface NeedDotProps {
  value: number;
  color: string;
}

/** Dims once a need is comfortably satisfied; stays bright as a low-need warning. */
export function NeedDot({ value, color }: NeedDotProps) {
  const opacity = value < 30 ? 1 : 0.3;
  return <View testID="need-dot" style={[styles.dot, { backgroundColor: color, opacity }]} />;
}

const styles = StyleSheet.create({
  dot: { width: 10, height: 10, borderRadius: 5 },
});
