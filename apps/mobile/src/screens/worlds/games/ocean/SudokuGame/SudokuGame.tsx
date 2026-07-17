import { ScrollView, Text } from 'react-native';
import type { GameProps } from '../../../GameScreen';
import { useSudokuGameState } from './hooks/useSudokuGameState';
import { SudokuGrid } from './components/SudokuGrid';
import { NumberPalette } from './components/NumberPalette';
import { styles } from './SudokuGame.styles';

export default function SudokuGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const gridSize = (params.gridSize as number) || 4;
  const boxRows = (params.boxRows as number) || 2;
  const boxCols = (params.boxCols as number) || 2;

  const {
    puzzle,
    displayGrid,
    currentBlank,
    filledKeys,
    result,
    roundsDone,
    handleChoice,
  } = useSudokuGameState({
    size: gridSize,
    boxRows,
    boxCols,
    blankCount: roundCount,
    onRoundComplete,
    onGameFinish,
    roundCount,
  });

  if (!puzzle) return null;

  const currentAnswer = currentBlank
    ? puzzle.solution[currentBlank.row][currentBlank.col]
    : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>
      <Text style={styles.instruction}>
        ¿Qué número va en el cuadrado amarillo? 🔢
      </Text>

      {/* Uses the generated puzzle's own dimensions, not the live `params`
          prop: the adaptive engine can bump the difficulty level mid-session
          (see decisiones técnicas del README), and this puzzle was already
          generated for the size it started with — switching sizes midway
          would desync the grid from the number palette. */}
      <SudokuGrid
        grid={displayGrid}
        size={puzzle.size}
        boxRows={puzzle.boxRows}
        boxCols={puzzle.boxCols}
        currentCell={currentBlank}
        filledKeys={filledKeys}
      />

      <NumberPalette
        size={puzzle.size}
        answer={currentAnswer}
        result={result}
        onChoose={handleChoice}
      />

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Muy bien! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! Era {currentAnswer}
        </Text>
      )}
    </ScrollView>
  );
}
