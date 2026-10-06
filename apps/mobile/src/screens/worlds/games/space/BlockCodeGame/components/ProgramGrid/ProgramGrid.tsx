import { Text, View } from 'react-native';
import type { Cell, Dir } from '../../../MazeGame/logic/generateMaze';
import { styles } from './ProgramGrid.styles';

export interface ProgramGridProps {
  maze: Cell[][];
  size: number;
  cellSize: number;
  pos: [number, number];
  facing: Dir;
  goal: [number, number];
}

const FACING_ROTATION: Record<Dir, string> = {
  top: '0deg',
  right: '90deg',
  bottom: '180deg',
  left: '270deg',
};

/** Renders the maze walls plus the robot at `pos` (rotated to `facing`) and the flag at the goal cell. */
export function ProgramGrid({
  maze,
  size,
  cellSize,
  pos,
  facing,
  goal,
}: ProgramGridProps) {
  const [pr, pc] = pos;
  const [gr, gc] = goal;

  return (
    <View
      style={[
        styles.gridWrapper,
        { width: size * cellSize + 4, height: size * cellSize + 4 },
      ]}
    >
      {maze.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((cell, c) => (
            <View
              key={c}
              testID="program-cell"
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
              {r === pr && c === pc && (
                <Text
                  testID="program-robot"
                  style={{
                    fontSize: cellSize * 0.55,
                    transform: [{ rotate: FACING_ROTATION[facing] }],
                  }}
                >
                  🤖
                </Text>
              )}
              {r === gr && c === gc && !(r === pr && c === pc) && (
                <Text style={{ fontSize: cellSize * 0.55 }}>🏁</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
