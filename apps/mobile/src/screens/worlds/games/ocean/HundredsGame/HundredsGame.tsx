import { useCallback, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import {
  buildRound,
  DIGIT_LABELS,
  type Mode,
  type Round,
} from './logic/buildRound';
import { IdentifyMode } from './components/IdentifyMode';
import { DecomposeMode } from './components/DecomposeMode';
import { ComposeMode } from './components/ComposeMode';
import { styles } from './HundredsGame.styles';

function announce(round: Round) {
  const { problem } = round;
  if (round.mode === 'identify')
    speak(`¿Cuántas ${DIGIT_LABELS[round.field]} tiene el ${problem.number}?`);
  else if (round.mode === 'decompose')
    speak(
      `Descomponé el número ${problem.number} en centenas, decenas y unidades`,
    );
  else
    speak(
      `${problem.hundreds} centenas más ${problem.tens} decenas más ${problem.units} unidades. ¿Qué número es?`,
    );
}

export default function HundredsGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const maxNumber = (params.maxNumber as number) || 99;
  const mode = (params.mode as Mode) || 'identify';

  const [round, setRound] = useState<Round | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const startRound = useCallback(() => {
    const next = buildRound(mode, maxNumber);
    setRound(next);
    announce(next);
  }, [maxNumber, mode]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleAnswer(correct: boolean) {
    if (result !== 'idle') return;
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
    submitAnswer(correct);
  }

  if (!round) return null;

  // While the correct/wrong feedback is on screen the round is already counted
  // as done, but the child is still looking at it, so the counter must wait.
  const roundOnScreen = result === 'idle' ? roundsDone + 1 : roundsDone;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: bounceAnim }] }]}
    >
      <Text style={styles.progress}>
        {roundOnScreen} / {roundCount}
      </Text>

      {round.mode === 'identify' && (
        <IdentifyMode round={round} onAnswer={handleAnswer} result={result} />
      )}
      {round.mode === 'decompose' && (
        <DecomposeMode round={round} onAnswer={handleAnswer} result={result} />
      )}
      {round.mode === 'compose' && (
        <ComposeMode round={round} onAnswer={handleAnswer} result={result} />
      )}

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>¡Inténtalo! 💪</Text>
      )}
    </Animated.View>
  );
}
