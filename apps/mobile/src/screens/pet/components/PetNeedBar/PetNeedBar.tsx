import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { styles } from './PetNeedBar.styles';

export interface PetNeedBarProps {
  icon?: ReactNode;
  label: string;
  value: number;
  color: string;
}

export function PetNeedBar({ icon, label, value, color }: PetNeedBarProps) {
  const pct = Math.round(value);
  return (
    <View style={styles.row}>
      <View style={styles.labelWrap}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={styles.pct}>{pct}</Text>
    </View>
  );
}
