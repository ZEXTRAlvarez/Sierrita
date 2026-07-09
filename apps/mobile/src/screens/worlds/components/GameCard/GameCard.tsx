import { Animated, Text, TouchableOpacity, View } from 'react-native';
import type { GameDef, WorldDef } from '../../data/worldsContent';
import { styles } from './GameCard.styles';

export interface GameCardProps {
  game: GameDef;
  world: WorldDef;
  profileAge: number;
  cardAnim: Animated.Value;
  onPress: () => void;
}

export function GameCard({
  game,
  world,
  profileAge,
  cardAnim,
  onPress,
}: GameCardProps) {
  const isLocked = game.minAge > profileAge;

  return (
    <Animated.View
      style={{
        opacity: cardAnim,
        transform: [
          {
            scale: cardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={[
          styles.card,
          { borderColor: world.color },
          isLocked && styles.cardLocked,
        ]}
        onPress={() => !isLocked && onPress()}
        activeOpacity={isLocked ? 1 : 0.8}
      >
        <Text style={[styles.emoji, isLocked && styles.emojiLocked]}>
          {game.emoji}
        </Text>
        <Text style={[styles.name, isLocked && styles.nameLocked]}>
          {game.name}
        </Text>
        {isLocked && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockText}>🔒 {game.minAge}+</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
