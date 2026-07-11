import { Text, View } from 'react-native';
import type { Cell } from '../../logic/generatePuzzle';
import { styles } from './SudokuGrid.styles';

export interface SudokuGridProps {
  grid: number[][];
  size: number;
  boxRows: number;
  boxCols: number;
  currentCell: Cell | null;
  filledKeys: Set<string>;
}

const CELL_SIZE: Record<number, number> = { 4: 62, 6: 46, 9: 34 };
const FONT_SIZE: Record<number, number> = { 4: 26, 6: 20, 9: 16 };

/** Purely visual NxN grid with thicker box borders and the current blank highlighted. */
export function SudokuGrid({
  grid,
  size,
  boxRows,
  boxCols,
  currentCell,
  filledKeys,
}: SudokuGridProps) {
  const cellSize = CELL_SIZE[size] ?? 34;
  const fontSize = FONT_SIZE[size] ?? 16;

  return (
    <View style={styles.grid} testID="sudoku-grid">
      {grid.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((value, c) => {
            const isCurrent = currentCell?.row === r && currentCell?.col === c;
            const isFilled = filledKeys.has(`${r},${c}`);
            const thickRight = (c + 1) % boxCols === 0 && c !== size - 1;
            const thickBottom = (r + 1) % boxRows === 0 && r !== size - 1;

            return (
              <View
                key={c}
                testID={isCurrent ? 'sudoku-current-cell' : undefined}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  thickRight && styles.thickRight,
                  thickBottom && styles.thickBottom,
                  isCurrent && styles.currentCell,
                  isFilled && styles.filledCell,
                ]}
              >
                {value > 0 && (
                  <Text
                    style={[
                      styles.value,
                      { fontSize },
                      isFilled && styles.filledValue,
                    ]}
                  >
                    {value}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
