import { useCallback, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import {
  generateRound,
  type BalanceAnswer,
  type BalanceMode,
  type BalanceRound,
} from './logic/generateRound';
import { BalanceScale } from './components/BalanceScale';
import { BalanceChoices } from './components/BalanceChoices';
import { styles } from './BalanceGame.styles';

const WRONG_FEEDBACK: Record<BalanceAnswer, string> = {
  left: '¡Casi! Pesaba más la izquierda',
  right: '¡Casi! Pesaba más la derecha',
  equal: '¡Casi! Estaban iguales',
};

export default function BalanceGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const mode = (params.mode as BalanceMode) || 'count';

  const [round, setRound] = useState<BalanceRound | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const startRound = useCallback(() => {
    setRound(generateRound(mode));
    speak('¿Qué lado pesa más?');
  }, [mode]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function bounce() {
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }

  function handleChoice(choice: BalanceAnswer) {
    if (!round || result !== 'idle') return;
    bounce();
    submitAnswer(choice === round.answer);
  }

  if (!round) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>
      <Text style={styles.instruction}>¿Qué lado pesa más? ⚖️</Text>

      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        <BalanceScale left={round.left} right={round.right} />
      </Animated.View>

      <BalanceChoices
        answer={round.answer}
        result={result}
        onChoose={handleChoice}
      />

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>
          ¡Bien pesado! ⭐
        </Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          {WRONG_FEEDBACK[round.answer]}
        </Text>
      )}
    </View>
  );
}
