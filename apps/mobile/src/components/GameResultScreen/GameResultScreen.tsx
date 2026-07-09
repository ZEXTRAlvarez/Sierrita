import { Animated, Text, TouchableOpacity, View } from 'react-native';
import type { GameSummary } from '@sierrita/games';
import { usePet } from '../../hooks/usePet';
import { WORLD_COLOR, STAR_MESSAGES } from './data/gameResultContent';
import { useGameResultAnimations } from './hooks/useGameResultAnimations';
import { Stat } from './components/Stat';
import { styles } from './GameResultScreen.styles';

interface Props {
  summary: GameSummary;
  onPlayAgain: () => void;
  onBack: () => void;
}

export default function GameResultScreen({
  summary,
  onPlayAgain,
  onBack,
}: Props) {
  const { rewardXp } = usePet();
  const { scale, opacity, starsScale, starsOpacity } = useGameResultAnimations(
    summary.xpEarned,
    rewardXp,
  );

  const color = WORLD_COLOR[summary.world] ?? '#4CAF50';
  const stars = '⭐'.repeat(summary.stars) + '☆'.repeat(3 - summary.stars);

  return (
    <View style={[styles.container, { backgroundColor: color + '22' }]}>
      <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
        <Animated.Text
          style={[
            styles.stars,
            { transform: [{ scale: starsScale }], opacity: starsOpacity },
          ]}
        >
          {stars}
        </Animated.Text>
        <Text style={styles.message}>{STAR_MESSAGES[summary.stars]}</Text>

        <View style={styles.statsRow}>
          <Stat
            label="Correctas"
            value={`${summary.correctRounds}/${summary.totalRounds}`}
          />
          <Stat label="XP ganado" value={`+${summary.xpEarned} ⭐`} />
          <Stat label="Tiempo" value={`${summary.durationSecs}s`} />
        </View>

        <View style={styles.scoreBar}>
          <View
            style={[
              styles.scoreFill,
              {
                width: `${Math.round(summary.scorePercent * 100)}%` as any,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <Text style={styles.scoreText}>
          {Math.round(summary.scorePercent * 100)}%
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: color }]}
            onPress={onPlayAgain}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>🔄 Jugar de nuevo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={onBack}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, { color: '#555' }]}>🏠 Volver</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
