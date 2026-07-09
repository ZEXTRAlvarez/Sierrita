import { Text, TouchableOpacity, View } from 'react-native';
import type { Dir } from '../../logic/generateMaze';
import { styles } from './DirectionControls.styles';

export interface DirectionControlsProps {
  canMove: (dir: Dir) => boolean;
  onMove: (dir: Dir) => void;
}

const LABELS: Record<Dir, string> = { top: '↑', left: '←', right: '→', bottom: '↓' };

/** The 4-direction D-pad; dims (but does not disable) a direction the rocket can't currently move in. */
export function DirectionControls({ canMove, onMove }: DirectionControlsProps) {
  const renderBtn = (dir: Dir) => (
    <TouchableOpacity
      key={dir}
      testID={`maze-dir-${dir}`}
      style={[styles.dirBtn, !canMove(dir) && styles.dirBtnDisabled]}
      onPress={() => onMove(dir)}
    >
      <Text style={styles.dirText}>{LABELS[dir]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.controls}>
      <View style={styles.controlRow}>{renderBtn('top')}</View>
      <View style={styles.controlRow}>
        {renderBtn('left')}
        <View style={styles.dirCenter} />
        {renderBtn('right')}
      </View>
      <View style={styles.controlRow}>{renderBtn('bottom')}</View>
    </View>
  );
}
