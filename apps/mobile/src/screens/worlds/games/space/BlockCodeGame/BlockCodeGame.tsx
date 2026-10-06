import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generatePuzzle, type Puzzle } from './logic/generatePuzzle';
import { runProgram, type BlockKind, type RunStep } from './logic/runProgram';
import { ProgramGrid } from './components/ProgramGrid';
import { styles } from './BlockCodeGame.styles';

const { width: SCREEN_W } = Dimensions.get('window');

const BLOCK_LABELS: Record<BlockKind, string> = {
  forward: '⬆️ Avanzar',
  forward2: '⏫ Avanzar x2',
  turnLeft: '⬅️ Girar',
  turnRight: '➡️ Girar',
};

export default function BlockCodeGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const gridSize = (params.gridSize as number) || 3;
  const availableBlocks = (params.blocks as BlockKind[]) || [
    'forward',
    'turnLeft',
    'turnRight',
  ];

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [program, setProgram] = useState<BlockKind[]>([]);
  const [steps, setSteps] = useState<RunStep[] | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startRound = useCallback(() => {
    setPuzzle(generatePuzzle(gridSize));
    setProgram([]);
    setSteps(null);
    setStepIndex(0);
    setIsRunning(false);
    speak('Armá los bloques para guiar al robot hasta la bandera');
  }, [gridSize]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  const locked = isRunning || result !== 'idle';

  function addBlock(kind: BlockKind) {
    if (locked) return;
    setProgram((prev) => [...prev, kind]);
  }

  function removeLastBlock() {
    if (locked) return;
    setProgram((prev) => prev.slice(0, -1));
  }

  function handleRun() {
    if (!puzzle || program.length === 0 || locked) return;
    setSteps(
      runProgram(puzzle.maze, puzzle.start, puzzle.startFacing, program),
    );
    setStepIndex(0);
    setIsRunning(true);
  }

  useEffect(() => {
    if (!isRunning || !steps || !puzzle) return;
    if (stepIndex >= steps.length - 1) {
      const finalPos = steps[steps.length - 1].pos;
      const reachedGoal =
        finalPos[0] === puzzle.goal[0] && finalPos[1] === puzzle.goal[1];
      setIsRunning(false);
      submitAnswer(reachedGoal);
      return;
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, stepIndex, steps]);

  if (!puzzle) return null;

  const current =
    steps && (isRunning || result !== 'idle')
      ? steps[Math.min(stepIndex, steps.length - 1)]
      : { pos: puzzle.start, facing: puzzle.startFacing };
  const cellSize = Math.min(Math.floor((SCREEN_W - 48) / gridSize), 58);

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <ProgramGrid
        maze={puzzle.maze}
        size={puzzle.size}
        cellSize={cellSize}
        pos={current.pos}
        facing={current.facing}
        goal={puzzle.goal}
      />

      <View style={styles.programRow} testID="program-sequence">
        {program.length === 0 ? (
          <Text style={styles.programHint}>Tocá los bloques de abajo</Text>
        ) : (
          program.map((block, i) => (
            <View key={i} style={styles.programChip}>
              <Text style={styles.programChipText}>{BLOCK_LABELS[block]}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.paletteRow}>
        {availableBlocks.map((block) => (
          <TouchableOpacity
            key={block}
            testID="block-option"
            style={styles.blockBtn}
            onPress={() => addBlock(block)}
            disabled={locked}
          >
            <Text style={styles.blockBtnText}>{BLOCK_LABELS[block]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          testID="block-undo"
          style={styles.undoBtn}
          onPress={removeLastBlock}
          disabled={locked || program.length === 0}
        >
          <Text style={styles.undoText}>↩️ Borrar último</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="block-run"
          style={[
            styles.runBtn,
            (locked || program.length === 0) && styles.runBtnDisabled,
          ]}
          onPress={handleRun}
          disabled={locked || program.length === 0}
        >
          <Text style={styles.runText}>▶️ Ejecutar</Text>
        </TouchableOpacity>
      </View>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>
          ¡Llegaste a la bandera! ⭐
        </Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! El robot no llegó a la bandera
        </Text>
      )}
    </View>
  );
}
