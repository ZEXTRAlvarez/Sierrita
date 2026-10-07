import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ChessBoard.styles';

export interface ChessBoardProps {
  size: number;
  cellSize: number;
  piecePos: [number, number];
  pieceGlyph: string;
  selected: Set<string>;
  /** Only passed once the round is answered, to color correct/missed/wrong squares. */
  validMoves?: Set<string>;
  onToggleSquare: (pos: [number, number]) => void;
  disabled?: boolean;
}

export function posKey(pos: [number, number]): string {
  return `${pos[0]},${pos[1]}`;
}

export function ChessBoard({
  size,
  cellSize,
  piecePos,
  pieceGlyph,
  selected,
  validMoves,
  onToggleSquare,
  disabled,
}: ChessBoardProps) {
  const [pr, pc] = piecePos;

  return (
    <View
      style={[
        styles.board,
        { width: size * cellSize, height: size * cellSize },
      ]}
    >
      {Array.from({ length: size }).map((_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: size }).map((_, c) => {
            const isPieceSquare = r === pr && c === pc;
            const key = posKey([r, c]);
            const isSelected = selected.has(key);
            const isDark = (r + c) % 2 === 1;

            let feedbackStyle = null;
            if (validMoves) {
              const isValid = validMoves.has(key);
              if (isValid && isSelected) feedbackStyle = styles.squareCorrect;
              else if (isValid && !isSelected)
                feedbackStyle = styles.squareMissed;
              else if (!isValid && isSelected)
                feedbackStyle = styles.squareWrong;
            } else if (isSelected) {
              feedbackStyle = styles.squareSelected;
            }

            return (
              <TouchableOpacity
                key={c}
                testID="chess-square"
                style={[
                  styles.square,
                  { width: cellSize, height: cellSize },
                  isDark ? styles.squareDark : styles.squareLight,
                  feedbackStyle,
                ]}
                onPress={() => onToggleSquare([r, c])}
                disabled={disabled}
              >
                {isPieceSquare && (
                  <Text
                    testID="chess-piece"
                    style={{ fontSize: cellSize * 0.6 }}
                  >
                    {pieceGlyph}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
