import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { WordClass } from '@sierrita/games';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { styles } from './WordClassGame.styles';

const CLASS_OPTIONS: { value: WordClass; label: string }[] = [
  { value: 'noun', label: 'Sustantivo' },
  { value: 'verb', label: 'Verbo' },
  { value: 'adjective', label: 'Adjetivo' },
];

export default function WordClassGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const sentenceChance = (params.sentenceChance as number) || 0;

  const [problem, setProblem] = useState<Problem | null>(null);

  const startRound = useCallback(() => {
    const p = generateProblem(sentenceChance);
    setProblem(p);
    if (p.mode === 'word') {
      speak(`¿Qué clase de palabra es ${p.word}?`);
    } else {
      speak(`¿Qué clase de palabra es ${p.words[p.targetIndex]}?`);
    }
  }, [sentenceChance]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleAnswer(value: WordClass) {
    if (!problem || result !== 'idle') return;
    submitAnswer(value === problem.correctClass);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Text style={styles.prompt}>¿Qué clase de palabra es...?</Text>

      {problem.mode === 'word' ? (
        <View style={styles.wordBox}>
          <Text style={styles.wordText}>{problem.word}</Text>
        </View>
      ) : (
        <View style={styles.sentenceBox}>
          {problem.words.map((w, i) => (
            <Text
              key={i}
              style={[
                styles.sentenceWord,
                i === problem.targetIndex && styles.sentenceWordTarget,
              ]}
            >
              {w}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.optionsRow}>
        {CLASS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            testID="wordclass-option"
            style={[
              styles.optionBtn,
              result !== 'idle' &&
                opt.value === problem.correctClass &&
                styles.correctBtn,
            ]}
            onPress={() => handleAnswer(opt.value)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! Es un{' '}
          {CLASS_OPTIONS.find((o) => o.value === problem.correctClass)?.label}
        </Text>
      )}
    </View>
  );
}
