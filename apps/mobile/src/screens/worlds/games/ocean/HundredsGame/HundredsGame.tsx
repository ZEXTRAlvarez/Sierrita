import { useCallback, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { IdentifyMode } from './components/IdentifyMode';
import { DecomposeMode } from './components/DecomposeMode';
import { ComposeMode } from './components/ComposeMode';
import { styles } from './HundredsGame.styles';

type Mode = 'identify' | 'decompose' | 'compose';

function announce(p: Problem, mode: Mode) {
  if (mode === 'identify') speak(`¿Cuántas centenas, decenas y unidades tiene el ${p.number}?`);
  else if (mode === 'decompose') speak(`Descomponé el número ${p.number} en centenas, decenas y unidades`);
  else speak(`${p.hundreds} centenas más ${p.tens} decenas más ${p.units} unidades. ¿Qué número es?`);
}

export default function HundredsGame({ params, onRoundComplete, onGameFinish, roundCount }: GameProps) {
  const maxNumber = (params.maxNumber as number) || 99;
  const mode = (params.mode as Mode) || 'identify';

  const [problem, setProblem] = useState<Problem | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const startRound = useCallback(() => {
    const p = generateProblem(maxNumber);
    setProblem(p);
    announce(p, mode);
  }, [maxNumber, mode]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount, onRoundComplete, onGameFinish, startRound,
  });

  function handleAnswer(correct: boolean) {
    if (result !== 'idle') return;
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    submitAnswer(correct);
  }

  if (!problem) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: bounceAnim }] }]}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>

      {mode === 'identify'  && <IdentifyMode  key={roundsDone} problem={problem} onAnswer={handleAnswer} result={result} />}
      {mode === 'decompose' && <DecomposeMode key={roundsDone} problem={problem} onAnswer={handleAnswer} result={result} />}
      {mode === 'compose'   && <ComposeMode   key={roundsDone} problem={problem} maxNumber={maxNumber} onAnswer={handleAnswer} result={result} />}

      {result === 'correct' && <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>}
      {result === 'wrong'   && <Text style={[styles.badge, styles.badgeWrong]}>¡Inténtalo! 💪</Text>}
    </Animated.View>
  );
}
