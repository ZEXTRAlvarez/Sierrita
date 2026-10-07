import { useCallback, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import type { PieceType } from './logic/getValidMoves';
import { ChessBoard, posKey } from './components/ChessBoard';
import { styles } from './ChessGame.styles';

const { width: SCREEN_W } = Dimensions.get('window');

const PIECE_INFO: Record<PieceType, { glyph: string; label: string }> = {
  pawn: { glyph: '♟', label: 'Peón' },
  rook: { glyph: '♜', label: 'Torre' },
  bishop: { glyph: '♝', label: 'Alfil' },
  knight: { glyph: '♞', label: 'Caballo' },
  queen: { glyph: '♛', label: 'Reina' },
  king: { glyph: '♚', label: 'Rey' },
};

export default function ChessGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const pieces = (params.pieces as PieceType[]) || ['pawn', 'rook'];
  const boardSize = (params.boardSize as number) || 5;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const startRound = useCallback(() => {
    const p = generateProblem(pieces, boardSize);
    setProblem(p);
    setSelected(new Set());
    speak(
      `¿A dónde se puede mover ${PIECE_INFO[p.piece].label.toLowerCase()}?`,
    );
  }, [pieces, boardSize]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function toggleSquare(pos: [number, number]) {
    if (result !== 'idle') return;
    const key = posKey(pos);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleConfirm() {
    if (!problem || result !== 'idle') return;
    const correctSet = new Set(problem.validMoves.map(posKey));
    const isCorrect =
      selected.size === correctSet.size &&
      [...selected].every((k) => correctSet.has(k));
    submitAnswer(isCorrect);
  }

  if (!problem) return null;

  const cellSize = Math.min(Math.floor((SCREEN_W - 48) / boardSize), 56);
  const validMovesSet =
    result !== 'idle' ? new Set(problem.validMoves.map(posKey)) : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Text style={styles.prompt}>
        ¿A dónde se puede mover {PIECE_INFO[problem.piece].label.toLowerCase()}?
      </Text>

      <ChessBoard
        size={boardSize}
        cellSize={cellSize}
        piecePos={problem.pos}
        pieceGlyph={PIECE_INFO[problem.piece].glyph}
        selected={selected}
        validMoves={validMovesSet}
        onToggleSquare={toggleSquare}
        disabled={result !== 'idle'}
      />

      <TouchableOpacity
        testID="chess-confirm"
        style={styles.confirmBtn}
        onPress={handleConfirm}
        disabled={result !== 'idle'}
      >
        <Text style={styles.confirmText}>¡Listo!</Text>
      </TouchableOpacity>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! Fíjate las casillas resaltadas
        </Text>
      )}
    </View>
  );
}
