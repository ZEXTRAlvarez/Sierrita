import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import {
  generateCarryProblem,
  type CasitaProblem,
  type Operation,
} from './logic/generateCarryProblem';
import { Casita } from './components/Casita';
import { PalitosTray } from './components/PalitosTray';
import { CasitaIntro } from './components/CasitaIntro';
import { styles } from './CasitaGame.styles';

function announce(p: CasitaProblem) {
  const opWord = p.op === 'add' ? 'más' : 'menos';
  speak(
    `${p.a} ${opWord} ${p.b}. Resolvé la casita empezando por las unidades.`,
  );
}

/** The actual round-by-round gameplay, mounted only once the child dismisses the intro. */
function CasitaRounds({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const maxOperand = (params.maxOperand as number) || 39;
  const operations = (params.operations as Operation[]) || ['add', 'sub'];
  const resultMax = (params.resultMax as number) || 99;
  const regroupChance = (params.regroupChance as number) ?? 0.6;
  const useHundreds = (params.useHundreds as boolean) ?? false;

  const [problem, setProblem] = useState<CasitaProblem | null>(null);
  // A counter bumped exactly when a new problem is set. `roundsDone` (from
  // useGameRound) updates earlier — right when the answer is submitted, a
  // beat before the *next* problem is generated — so keying Casita's remount
  // off it caused Casita to remount with the *previous* problem and then
  // silently receive the real new one as a prop update, leaving its digit
  // options (computed once via useRef) stuck on stale, mismatched values.
  const [problemIndex, setProblemIndex] = useState(0);

  const startRound = useCallback(() => {
    const forceRegroup = Math.random() < regroupChance;
    const p = generateCarryProblem(
      maxOperand,
      operations,
      resultMax,
      forceRegroup,
      useHundreds,
    );
    setProblem(p);
    setProblemIndex((i) => i + 1);
    announce(p);
  }, [maxOperand, operations, resultMax, regroupChance, useHundreds]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleAnswer(correct: boolean) {
    submitAnswer(correct);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>
      <Text style={styles.instruction}>
        Resolvé la casita: primero las unidades 👇
      </Text>

      <Casita
        key={`casita-${problemIndex}`}
        problem={problem}
        onAnswer={handleAnswer}
        result={result}
      />

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! Era {problem.result}
        </Text>
      )}

      <PalitosTray key={`palitos-${problemIndex}`} />
    </View>
  );
}

export default function CasitaGame(props: GameProps) {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <CasitaIntro onFinish={() => setShowIntro(false)} />;
  }

  return <CasitaRounds {...props} />;
}
