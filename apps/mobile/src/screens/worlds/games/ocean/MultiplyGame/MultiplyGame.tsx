import { useCallback, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { generateOptions } from './logic/generateOptions';
import { GroupsVisual } from './components/GroupsVisual';
import { styles } from './MultiplyGame.styles';

export default function MultiplyGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const maxTable = (params.maxTable as number) || 5;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const startRound = useCallback(() => {
    const p = generateProblem(maxTable);
    setProblem(p);
    const max = p.op === 'multiply' ? maxTable * 10 : 10;
    setOptions(generateOptions(p.result, max));
    const opWord = p.op === 'multiply' ? 'por' : 'dividido';
    speak(`${p.a} ${opWord} ${p.b} es igual a...`);
  }, [maxTable]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function shake() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handleAnswer(answer: number) {
    if (!problem || result !== 'idle') return;
    if (answer !== problem.result) shake();
    submitAnswer(answer === problem.result);
  }

  if (!problem) return null;

  const opSymbol = problem.op === 'multiply' ? '×' : '÷';

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Animated.View
        style={[styles.equationBox, { transform: [{ translateX: shakeAnim }] }]}
      >
        <Text style={styles.equationText}>
          {problem.a} {opSymbol} {problem.b} = ?
        </Text>
      </Animated.View>

      <GroupsVisual op={problem.op} a={problem.a} b={problem.b} />

      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            testID="multiply-option"
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
