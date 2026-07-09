import { Animated, Text, View } from 'react-native';
import { IconAnimation } from '../../../../components/IconAnimation';
import type { WorldDef } from '../../data/worldsContent';
import { GameCard } from '../GameCard';
import { styles } from './WorldSection.styles';

export interface WorldSectionProps {
  world: WorldDef;
  profileAge: number;
  entrance: Animated.Value;
  onPressGame: (gameId: string) => void;
}

export function WorldSection({
  world,
  profileAge,
  entrance,
  onPressGame,
}: WorldSectionProps) {
  const unlockedCount = world.games.filter(
    (g) => g.minAge <= profileAge,
  ).length;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.header, { backgroundColor: world.dark }]}>
        <IconAnimation name={world.iconName} size={64} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{world.name}</Text>
          <Text style={styles.subject}>{world.subject}</Text>
        </View>
        <View style={[styles.progressBadge, { backgroundColor: world.color }]}>
          <Text style={styles.progressText}>
            {unlockedCount}/{world.games.length}
          </Text>
        </View>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: world.light }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${(unlockedCount / world.games.length) * 100}%` as any,
              backgroundColor: world.color,
            },
          ]}
        />
      </View>

      <View style={[styles.gameGrid, { backgroundColor: world.light }]}>
        {world.games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            world={world}
            profileAge={profileAge}
            cardAnim={entrance}
            onPress={() => onPressGame(game.id)}
          />
        ))}
      </View>
    </Animated.View>
  );
}
