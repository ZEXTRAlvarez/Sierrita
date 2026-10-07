import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { MatterState } from '@sierrita/games';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { styles } from './MatterGame.styles';

const STATE_OPTIONS: { value: MatterState; label: string; emoji: string }[] = [
  { value: 'solid', label: 'Sólido', emoji: '🧊' },
  { value: 'liquid', label: 'Líquido', emoji: '💧' },
  { value: 'gas', label: 'Gas', emoji: '💨' },
];

export default function MatterGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const tiers = (params.tiers as number[]) || [1];
  const transformChance = (params.transformChance as number) || 0;

  const [problem, setProblem] = useState<Problem | null>(null);

  const startRound = useCallback(() => {
    const p = generateProblem(tiers, transformChance);
    setProblem(p);
    if (p.mode === 'item') {
      speak(`¿Qué estado es ${p.item.label}?`);
    } else {
      speak(`${p.transformation.label}. ¿En qué estado queda?`);
    }
  }, [tiers, transformChance]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleAnswer(value: MatterState) {
    if (!problem || result !== 'idle') return;
    submitAnswer(value === problem.correctState);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      {problem.mode === 'item' ? (
        <>
          <Text style={styles.prompt}>¿Qué estado es...?</Text>
          <View style={styles.itemBox}>
            <Text style={styles.itemEmoji}>{problem.item.emoji}</Text>
            <Text style={styles.itemLabel}>{problem.item.label}</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.prompt}>¿En qué estado queda?</Text>
          <View style={styles.itemBox}>
            <Text style={styles.itemEmoji}>{problem.transformation.emoji}</Text>
            <Text style={styles.itemLabel}>{problem.transformation.label}</Text>
          </View>
        </>
      )}

      <View style={styles.optionsRow}>
        {STATE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            testID="matter-option"
            style={[
              styles.optionBtn,
              result !== 'idle' &&
                opt.value === problem.correctState &&
                styles.correctBtn,
            ]}
            onPress={() => handleAnswer(opt.value)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionEmoji}>{opt.emoji}</Text>
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! Es:{' '}
          {STATE_OPTIONS.find((o) => o.value === problem.correctState)?.label}
        </Text>
      )}
    </View>
  );
}
