import { Text, View } from 'react-native';
import type { Cell } from '../../logic/generateMaze';
import { styles } from './MazeGrid.styles';

export interface MazeGridProps {
  maze: Cell[][];
  gridSize: number;
  cellSize: number;
  pos: [number, number];
}

/** Renders the maze walls plus the rocket at `pos` and the star at the goal cell. */
export function MazeGrid({ maze, gridSize, cellSize, pos }: MazeGridProps) {
  const [pr, pc] = pos;

  return (
    <View style={[styles.mazeWrapper, { width: gridSize * cellSize + 4, height: gridSize * cellSize + 4 }]}>
      {maze.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((cell, c) => (
            <View
              key={c}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  borderTopWidth: cell.top ? 2 : 0,
                  borderRightWidth: cell.right ? 2 : 0,
                  borderBottomWidth: cell.bottom ? 2 : 0,
                  borderLeftWidth: cell.left ? 2 : 0,
                },
              ]}
            >
              {r === pr && c === pc && <Text style={{ fontSize: cellSize * 0.55 }}>🚀</Text>}
              {r === gridSize - 1 && c === gridSize - 1 && !(r === pr && c === pc) && (
                <Text style={{ fontSize: cellSize * 0.55 }}>⭐</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
