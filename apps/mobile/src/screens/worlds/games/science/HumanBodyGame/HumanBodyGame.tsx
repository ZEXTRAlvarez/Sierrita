import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { BodySilhouette } from './components/BodySilhouette';
import { styles } from './HumanBodyGame.styles';

export default function HumanBodyGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const tiers = (params.tiers as number[]) || [1];

  const [problem, setProblem] = useState<Problem | null>(null);

  const startRound = useCallback(() => {
    const p = generateProblem(tiers);
    setProblem(p);
    speak('¿Cómo se llama la parte señalada?');
  }, [tiers]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleAnswer(option: string) {
    if (!problem || result !== 'idle') return;
    submitAnswer(option === problem.part.label);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Text style={styles.prompt}>¿Cómo se llama la parte señalada?</Text>

      <BodySilhouette markerX={problem.part.x} markerY={problem.part.y} />

      <View style={styles.optionsRow}>
        {problem.options.map((opt) => (
          <TouchableOpacity
            key={opt}
            testID="body-option"
            style={[
              styles.optionBtn,
              result !== 'idle' &&
                opt === problem.part.label &&
                styles.correctBtn,
            ]}
            onPress={() => handleAnswer(opt)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! Es: {problem.part.label}
        </Text>
      )}
    </View>
  );
}
