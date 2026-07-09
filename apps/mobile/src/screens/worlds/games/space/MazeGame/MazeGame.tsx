import { Text, View } from 'react-native';
import type { GameProps } from '../../../GameScreen';
import { useMazeGameState } from './hooks/useMazeGameState';
import { MazeGrid } from './components/MazeGrid';
import { DirectionControls } from './components/DirectionControls';
import { styles } from './MazeGame.styles';

export default function MazeGame({ params, onRoundComplete, onGameFinish }: GameProps) {
  const gridSize = (params.gridSize as number) || 5;

  const { maze, pos, finished, cellSize, canMove, move } = useMazeGameState({
    gridSize, onRoundComplete, onGameFinish,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Guiá 🚀 hasta ⭐</Text>

      <MazeGrid maze={maze} gridSize={gridSize} cellSize={cellSize} pos={pos} />

      {!finished && <DirectionControls canMove={canMove} onMove={move} />}

      {finished && <Text style={[styles.badge, styles.badgeFinished]}>¡Llegaste! 🎉</Text>}
    </View>
  );
}
