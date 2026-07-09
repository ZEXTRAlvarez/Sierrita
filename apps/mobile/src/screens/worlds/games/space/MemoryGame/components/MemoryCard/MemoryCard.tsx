import { Animated, Text, TouchableOpacity } from 'react-native';
import type { Card } from '../../logic/buildDeck';
import { styles } from './MemoryCard.styles';

export interface MemoryCardProps {
  card: Card;
  size: number;
  locked: boolean;
  scale: Animated.Value;
  onPress: () => void;
}

/** A single flippable memory card: shows the back glyph until flipped or matched. */
export function MemoryCard({
  card,
  size,
  locked,
  scale,
  onPress,
}: MemoryCardProps) {
  const revealed = card.flipped || card.matched;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        testID="memory-card"
        style={[
          styles.card,
          { width: size, height: size },
          card.flipped && !card.matched && styles.cardFlipped,
          card.matched && styles.cardMatched,
        ]}
        onPress={onPress}
        disabled={revealed || locked}
      >
        {revealed ? (
          <Text style={{ fontSize: size * 0.48 }}>{card.emoji}</Text>
        ) : (
          <Text style={styles.cardBack}>🔮</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
