import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { styles } from './SynonymsGame.styles';

export default function SynonymsGame({
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
    const modeWord = p.mode === 'synonym' ? 'un sinónimo' : 'un antónimo';
    speak(`¿Cuál es ${modeWord} de ${p.entry.word}?`);
  }, [tiers]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleAnswer(option: string) {
    if (!problem || result !== 'idle') return;
    submitAnswer(option === problem.correct);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Text style={styles.prompt}>
        ¿Cuál es {problem.mode === 'synonym' ? 'un sinónimo' : 'un antónimo'}{' '}
        de...?
      </Text>

      <View style={styles.wordBox}>
        <Text style={styles.wordText}>{problem.entry.word}</Text>
      </View>

      <View style={styles.optionsRow}>
        {problem.options.map((opt) => (
          <TouchableOpacity
            key={opt}
            testID="synonym-option"
            style={[
              styles.optionBtn,
              result !== 'idle' && opt === problem.correct && styles.correctBtn,
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
          ¡Casi! La respuesta es {problem.correct}
        </Text>
      )}
    </View>
  );
}
