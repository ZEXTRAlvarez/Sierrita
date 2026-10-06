import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { WordProblemOperation } from '@sierrita/games';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { generateOptions } from './logic/generateOptions';
import { styles } from './WordProblemsGame.styles';

export default function WordProblemsGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const operations = (params.operations as WordProblemOperation[]) || ['add'];
  const maxOperand = (params.maxOperand as number) || 10;
  const resultMax = (params.resultMax as number) || 20;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<number[]>([]);

  const startRound = useCallback(() => {
    const p = generateProblem(operations, maxOperand, resultMax);
    const text = p.template.text(p.name, p.a, p.b);
    setProblem(p);
    setQuestionText(text);
    setOptions(generateOptions(p.result, resultMax));
    speak(text);
  }, [operations, maxOperand, resultMax]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleAnswer(answer: number) {
    if (!problem || result !== 'idle') return;
    submitAnswer(answer === problem.result);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <View style={styles.questionBox}>
        <Text style={styles.emoji}>{problem.template.emoji}</Text>
        <Text style={styles.questionText}>{questionText}</Text>
      </View>

      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            testID="wordproblem-option"
            style={[
              styles.optionBtn,
              result !== 'idle' && opt === problem.result && styles.correctBtn,
              result === 'wrong' && opt !== problem.result && styles.dimBtn,
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
          ¡Casi! La respuesta es {problem.result}
        </Text>
      )}
    </View>
  );
}
