import { Text, TouchableOpacity, View } from 'react-native';
import { levelLabel } from '@sierrita/adaptive';
import { styles } from './GameScreenHeader.styles';

export interface GameScreenHeaderProps {
  title: string;
  currentLevel: 1 | 2 | 3;
  color: string;
  onBack: () => void;
}

export function GameScreenHeader({ title, currentLevel, color, onBack }: GameScreenHeaderProps) {
  return (
    <View style={[styles.header, { backgroundColor: color }]}>
      <TouchableOpacity onPress={onBack} hitSlop={16}>
        <Text style={styles.back}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.level}>{levelLabel(currentLevel)}</Text>
    </View>
  );
}
