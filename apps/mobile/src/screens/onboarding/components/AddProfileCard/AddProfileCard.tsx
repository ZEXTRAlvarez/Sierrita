import { Animated, Text, TouchableOpacity } from 'react-native';
import { CARD_H, CARD_W } from '../../data/profileCardMetrics';
import { styles } from './AddProfileCard.styles';

export interface AddProfileCardProps {
  anim: Animated.Value;
  onPress: () => void;
}

export function AddProfileCard({ anim, onPress }: AddProfileCardProps) {
  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale: anim }] }}>
      <TouchableOpacity
        style={[styles.card, styles.newCard, { width: CARD_W, height: CARD_H }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.plusEmoji}>+</Text>
        <Text style={styles.newLabel}>Nuevo perfil</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
