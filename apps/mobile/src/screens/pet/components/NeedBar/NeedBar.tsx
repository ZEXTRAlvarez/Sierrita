import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export interface NeedBarProps {
  icon?: ReactNode;
  label: string;
  value: number;
  color: string;
}

export function NeedBar({ icon, label, value, color }: NeedBarProps) {
  const pct = Math.round(value);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: pct / 100, damping: 14, stiffness: 80, useNativeDriver: false }).start();
  }, [pct, anim]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.row}>
      <View style={styles.labelWrap}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: width as unknown as number, backgroundColor: color }]} />
      </View>
      <Text style={[styles.pct, { color }]}>{pct}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  labelWrap: { width: 80, flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 13, fontWeight: '700', color: '#666' },
  track: { flex: 1, height: 14, backgroundColor: '#EEE', borderRadius: 7, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 7 },
  pct: { fontSize: 12, fontWeight: '800', width: 28, textAlign: 'right' },
});
