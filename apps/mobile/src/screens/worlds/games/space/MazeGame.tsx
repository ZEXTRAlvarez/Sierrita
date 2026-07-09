import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../GameScreen';

// ── Maze generation (recursive backtracking) ─────────────────────────────────

interface Cell {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

type Dir = 'top' | 'right' | 'bottom' | 'left';
const OPPOSITE: Record<Dir, Dir> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const MOVES: Record<Dir, [number, number]> = { top: [-1,0], bottom: [1,0], left: [0,-1], right: [0,1] };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateMaze(size: number): Cell[][] {
  const grid: (Cell & { visited: boolean })[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      top: true, right: true, bottom: true, left: true, visited: false,
    })),
  );

  function carve(r: number, c: number) {
    grid[r][c].visited = true;
    const dirs = shuffle<Dir>(['top', 'right', 'bottom', 'left']);
    for (const dir of dirs) {
      const [dr, dc] = MOVES[dir];
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !grid[nr][nc].visited) {
        grid[r][c][dir] = false;
        grid[nr][nc][OPPOSITE[dir]] = false;
        carve(nr, nc);
      }
    }
  }

  carve(0, 0);
  return grid;
}

// ── Component ─────────────────────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get('window');

export default function MazeGame({
  params,
  onRoundComplete,
  onGameFinish,
}: GameProps) {
  const gridSize = (params.gridSize as number) || 5;

  const [maze, setMaze]     = useState<Cell[][]>(() => generateMaze(gridSize));
  const [pos, setPos]       = useState<[number, number]>([0, 0]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    speak('¡Guiá al cohete hasta la estrella!');
  }, []);

  const cellSize = Math.min(
    Math.floor((SCREEN_W - 48) / gridSize),
    58,
  );

  const canMove = useCallback((dir: Dir) => {
    const [r, c] = pos;
    return !maze[r][c][dir];
  }, [maze, pos]);

  const move = useCallback(async (dir: Dir) => {
    if (finished) return;
    if (!canMove(dir)) return;

    const [dr, dc] = MOVES[dir];
    const [r, c]   = pos;
    const nr = r + dr;
    const nc = c + dc;

    setPos([nr, nc]);

    if (nr === gridSize - 1 && nc === gridSize - 1) {
      setFinished(true);
      speak('¡Llegaste a la estrella!');
      await onRoundComplete(true, 0);
      setTimeout(() => onGameFinish(), 800);
    }
  }, [finished, canMove, pos, gridSize, onRoundComplete, onGameFinish]);

  const [pr, pc] = pos;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Guiá 🚀 hasta ⭐</Text>

      {/* Maze grid */}
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
                    borderTopWidth:    cell.top    ? 2 : 0,
                    borderRightWidth:  cell.right  ? 2 : 0,
                    borderBottomWidth: cell.bottom ? 2 : 0,
                    borderLeftWidth:   cell.left   ? 2 : 0,
                  },
                ]}
              >
                {r === pr && c === pc && (
                  <Text style={{ fontSize: cellSize * 0.55 }}>🚀</Text>
                )}
                {r === gridSize - 1 && c === gridSize - 1 && !(r === pr && c === pc) && (
                  <Text style={{ fontSize: cellSize * 0.55 }}>⭐</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Direction buttons */}
      {!finished && (
        <View style={styles.controls}>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[styles.dirBtn, !canMove('top') && styles.dirBtnDisabled]}
              onPress={() => move('top')}
            >
              <Text style={styles.dirText}>↑</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[styles.dirBtn, !canMove('left') && styles.dirBtnDisabled]}
              onPress={() => move('left')}
            >
              <Text style={styles.dirText}>←</Text>
            </TouchableOpacity>
            <View style={styles.dirCenter} />
            <TouchableOpacity
              style={[styles.dirBtn, !canMove('right') && styles.dirBtnDisabled]}
              onPress={() => move('right')}
            >
              <Text style={styles.dirText}>→</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[styles.dirBtn, !canMove('bottom') && styles.dirBtnDisabled]}
              onPress={() => move('bottom')}
            >
              <Text style={styles.dirText}>↓</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {finished && (
        <Text style={[styles.badge, { backgroundColor: '#7B1FA2' }]}>
          ¡Llegaste! 🎉
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#1A0A2E',
  },
  instruction: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E1BEE7',
    marginBottom: 16,
  },
  mazeWrapper: {
    borderWidth: 2,
    borderColor: '#CE93D8',
    backgroundColor: '#0D0721',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderColor: '#7E57C2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0721',
  },
  controls: {
    gap: 4,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dirBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7B1FA2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  dirBtnDisabled: {
    backgroundColor: '#4A148C',
    opacity: 0.45,
  },
  dirCenter: { width: 72, height: 72 },
  dirText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 36,
  },
  badge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
