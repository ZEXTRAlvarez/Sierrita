import { useCallback, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { WaterContainer } from './components/WaterContainer';
import { styles } from './FloatGame.styles';

const FLOAT_Y = 20;
const SINK_Y = 130;

export default function FloatGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const tiers = (params.tiers as number[]) || [1];

  const [problem, setProblem] = useState<Problem | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  const startRound = useCallback(() => {
    const p = generateProblem(tiers);
    setProblem(p);
    translateY.setValue(0);
    speak(`¿${p.item.label} flota o se hunde?`);
  }, [tiers, translateY]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handlePredict(predictFloats: boolean) {
    if (!problem || result !== 'idle') return;
    Animated.timing(translateY, {
      toValue: problem.item.floats ? FLOAT_Y : SINK_Y,
      duration: 600,
      useNativeDriver: false,
    }).start();
    submitAnswer(predictFloats === problem.item.floats);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Text style={styles.prompt}>¿{problem.item.label} flota o se hunde?</Text>

      <WaterContainer emoji={problem.item.emoji} translateY={translateY} />

      <View style={styles.optionsRow}>
        <TouchableOpacity
          testID="float-option-floats"
          style={styles.optionBtn}
          onPress={() => handlePredict(true)}
          disabled={result !== 'idle'}
        >
          <Text style={styles.optionText}>🛟 Flota</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="float-option-sinks"
          style={styles.optionBtn}
          onPress={() => handlePredict(false)}
          disabled={result !== 'idle'}
        >
          <Text style={styles.optionText}>⬇️ Se hunde</Text>
        </TouchableOpacity>
      </View>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! {problem.item.label}{' '}
          {problem.item.floats ? 'flota' : 'se hunde'}
        </Text>
      )}
    </View>
  );
}
