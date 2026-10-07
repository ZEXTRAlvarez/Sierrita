import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { FoodChainLink } from '@sierrita/games';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { styles } from './FoodChainGame.styles';

export default function FoodChainGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const lengths = (params.lengths as number[]) || [3];

  const [problem, setProblem] = useState<Problem | null>(null);
  const [placed, setPlaced] = useState<FoodChainLink[]>([]);
  const [available, setAvailable] = useState<FoodChainLink[]>([]);

  const startRound = useCallback(() => {
    const p = generateProblem(lengths);
    setProblem(p);
    setPlaced([]);
    setAvailable(p.shuffled);
    speak('Ordená quién se come a quién, del productor al depredador');
  }, [lengths]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  const locked = result !== 'idle';

  function placeLink(link: FoodChainLink, index: number) {
    if (locked) return;
    setAvailable((prev) => prev.filter((_, i) => i !== index));
    setPlaced((prev) => [...prev, link]);
  }

  function removeLink(link: FoodChainLink, index: number) {
    if (locked) return;
    setPlaced((prev) => prev.filter((_, i) => i !== index));
    setAvailable((prev) => [...prev, link]);
  }

  function handleConfirm() {
    if (!problem || available.length > 0 || locked) return;
    const isCorrect = placed.every(
      (l, i) => l.label === problem.chain.links[i].label,
    );
    submitAnswer(isCorrect);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Text style={styles.prompt}>Ordená: productor → ... → depredador</Text>

      <View style={styles.placedRow} testID="chain-placed">
        {placed.length === 0 ? (
          <Text style={styles.placedHint}>Tocá los seres vivos de abajo</Text>
        ) : (
          placed.map((link, i) => (
            <TouchableOpacity
              key={`${link.label}-${i}`}
              testID="chain-placed-item"
              style={styles.placedChip}
              onPress={() => removeLink(link, i)}
              disabled={locked}
            >
              <Text style={styles.chipEmoji}>{link.emoji}</Text>
              <Text style={styles.chipLabel}>{link.label}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.availableRow}>
        {available.map((link, i) => (
          <TouchableOpacity
            key={`${link.label}-${i}`}
            testID="chain-available-item"
            style={styles.availableChip}
            onPress={() => placeLink(link, i)}
            disabled={locked}
          >
            <Text style={styles.chipEmoji}>{link.emoji}</Text>
            <Text style={styles.chipLabel}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        testID="chain-confirm"
        style={[
          styles.confirmBtn,
          (available.length > 0 || locked) && styles.confirmBtnDisabled,
        ]}
        onPress={handleConfirm}
        disabled={available.length > 0 || locked}
      >
        <Text style={styles.confirmText}>¡Listo!</Text>
      </TouchableOpacity>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! El orden correcto era:{' '}
          {problem.chain.links.map((l) => l.label).join(' → ')}
        </Text>
      )}
    </View>
  );
}
