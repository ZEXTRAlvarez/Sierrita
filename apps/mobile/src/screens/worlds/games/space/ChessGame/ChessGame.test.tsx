import React from 'react';
import { render, fireEvent, act, within } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import ChessGame from './ChessGame';
import { getValidMoves } from './logic/getValidMoves';

const BOARD_SIZE = 3;

function getSquares(utils: {
  getAllByTestId: (id: string) => ReactTestInstance[];
}): ReactTestInstance[] {
  return utils.getAllByTestId('chess-square');
}

function findPiecePos(squares: ReactTestInstance[]): [number, number] {
  const idx = squares.findIndex(
    (sq) => within(sq).queryAllByTestId('chess-piece').length > 0,
  );
  return [Math.floor(idx / BOARD_SIZE), idx % BOARD_SIZE];
}

describe('ChessGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the board and the confirm button', () => {
    const { getByText, getAllByTestId, getByTestId } = render(
      <ChessGame
        params={{ pieces: ['rook'], boardSize: BOARD_SIZE }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('chess-square')).toHaveLength(9);
    expect(getByTestId('chess-confirm')).toBeTruthy();
  });

  it('marks the round correct when exactly the valid squares are selected', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const utils = render(
      <ChessGame
        params={{ pieces: ['rook'], boardSize: BOARD_SIZE }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const squares = getSquares(utils);
    const pos = findPiecePos(squares);
    const validMoves = getValidMoves('rook', pos, BOARD_SIZE);

    for (const [r, c] of validMoves) {
      fireEvent.press(squares[r * BOARD_SIZE + c]);
    }

    await act(async () => {
      fireEvent.press(utils.getByTestId('chess-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('marks the round wrong when no square is selected', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const utils = render(
      <ChessGame
        params={{ pieces: ['rook'], boardSize: BOARD_SIZE }}
        onRoundComplete={onRoundComplete}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(utils.getByTestId('chess-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0, 0);
  });

  it('marks the round wrong after toggling one previously-selected square back off', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const utils = render(
      <ChessGame
        params={{ pieces: ['rook'], boardSize: BOARD_SIZE }}
        onRoundComplete={onRoundComplete}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    const squares = getSquares(utils);
    const pos = findPiecePos(squares);
    const validMoves = getValidMoves('rook', pos, BOARD_SIZE);

    for (const [r, c] of validMoves) {
      fireEvent.press(squares[r * BOARD_SIZE + c]);
    }
    const [fr, fc] = validMoves[0];
    fireEvent.press(squares[fr * BOARD_SIZE + fc]); // toggle it back off

    await act(async () => {
      fireEvent.press(utils.getByTestId('chess-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0, 0);
  });

  it('falls back to a 5x5 board with pawn/rook when no params are given', () => {
    const { getAllByTestId } = render(
      <ChessGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getAllByTestId('chess-square')).toHaveLength(25);
  });
});
