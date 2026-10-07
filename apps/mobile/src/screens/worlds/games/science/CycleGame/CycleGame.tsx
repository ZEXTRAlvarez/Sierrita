import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { CycleStage } from '@sierrita/games';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { isValidCycleOrder } from './logic/isValidCycleOrder';
import { styles } from './CycleGame.styles';

export default function CycleGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const lengths = (params.lengths as number[]) || [3];

  const [problem, setProblem] = useState<Problem | null>(null);
  const [placed, setPlaced] = useState<CycleStage[]>([]);
  const [available, setAvailable] = useState<CycleStage[]>([]);

  const startRound = useCallback(() => {
    const p = generateProblem(lengths);
    setProblem(p);
    setPlaced([]);
    setAvailable(p.shuffled);
    speak(`Ordená las etapas del ${p.cycle.name}`);
  }, [lengths]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  const locked = result !== 'idle';

  function placeStage(stage: CycleStage, index: number) {
    if (locked) return;
    setAvailable((prev) => prev.filter((_, i) => i !== index));
    setPlaced((prev) => [...prev, stage]);
  }

  function removeStage(stage: CycleStage, index: number) {
    if (locked) return;
    setPlaced((prev) => prev.filter((_, i) => i !== index));
    setAvailable((prev) => [...prev, stage]);
  }

  function handleConfirm() {
    if (!problem || available.length > 0 || locked) return;
    const isCorrect = isValidCycleOrder(
      placed.map((s) => s.label),
      problem.cycle.stages.map((s) => s.label),
      problem.cycle.isCircular,
    );
    submitAnswer(isCorrect);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Text style={styles.prompt}>{problem.cycle.name}</Text>

      <View style={styles.placedRow} testID="cycle-placed">
        {placed.length === 0 ? (
          <Text style={styles.placedHint}>Tocá las etapas de abajo</Text>
        ) : (
          placed.map((stage, i) => (
            <TouchableOpacity
              key={`${stage.label}-${i}`}
              testID="cycle-placed-item"
              style={styles.placedChip}
              onPress={() => removeStage(stage, i)}
              disabled={locked}
            >
              <Text style={styles.chipEmoji}>{stage.emoji}</Text>
              <Text style={styles.chipLabel}>{stage.label}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.availableRow}>
        {available.map((stage, i) => (
          <TouchableOpacity
            key={`${stage.label}-${i}`}
            testID="cycle-available-item"
            style={styles.availableChip}
            onPress={() => placeStage(stage, i)}
            disabled={locked}
          >
            <Text style={styles.chipEmoji}>{stage.emoji}</Text>
            <Text style={styles.chipLabel}>{stage.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        testID="cycle-confirm"
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
          {problem.cycle.stages.map((s) => s.label).join(' → ')}
        </Text>
      )}
    </View>
  );
}
