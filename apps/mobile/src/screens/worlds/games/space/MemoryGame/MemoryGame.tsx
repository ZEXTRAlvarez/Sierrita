import { Animated, Text, View } from 'react-native';
import type { GameProps } from '../../../GameScreen';
import { useMemoryGameState } from './hooks/useMemoryGameState';
import { MemoryCard } from './components/MemoryCard';
import { styles } from './MemoryGame.styles';

export default function MemoryGame({
  params,
  onRoundComplete,
  onGameFinish,
}: GameProps) {
  const pairs = (params.pairs as number) || 4;
  const flipDelay = (params.flipDelay as number) || 1200;

  const { cards, matched, finished, locked, scaleAnims, handleCardPress } =
    useMemoryGameState({
      pairs,
      flipDelay,
      onRoundComplete,
      onGameFinish,
    });

  const cols = pairs <= 4 ? 2 : pairs <= 6 ? 3 : 4;
  const cardSize = pairs <= 4 ? 88 : pairs <= 6 ? 76 : 64;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Pares: {matched} / {pairs}
      </Text>
      <Text style={styles.instruction}>¡Encontrá los pares! 🌟</Text>

      <View style={[styles.grid, { maxWidth: cols * (cardSize + 10) + 16 }]}>
        {cards.map((card, idx) => (
          <MemoryCard
            key={card.id}
            card={card}
            size={cardSize}
            locked={locked}
            scale={scaleAnims[idx] ?? new Animated.Value(1)}
            onPress={() => handleCardPress(idx)}
          />
        ))}
      </View>

      {finished && (
        <Text style={[styles.badge, styles.badgeFinished]}>
          ¡Ganaste! 🎉 {pairs} pares encontrados
        </Text>
      )}
    </View>
  );
}
