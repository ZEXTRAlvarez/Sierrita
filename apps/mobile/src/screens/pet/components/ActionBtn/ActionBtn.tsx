import type { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './ActionBtn.styles';

export interface ActionBtnProps {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  colors: [string, string];
}

export function ActionBtn({ icon, label, onPress, colors }: ActionBtnProps) {
  return (
    <View style={styles.shadow}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.wrap}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.btn}>
          <View style={styles.iconBox}>{icon}</View>
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
