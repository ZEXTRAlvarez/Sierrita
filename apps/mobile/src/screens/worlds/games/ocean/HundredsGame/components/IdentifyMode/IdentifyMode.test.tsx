import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { IdentifyRound } from '../../logic/buildRound';
import { IdentifyMode } from './IdentifyMode';

const round: IdentifyRound = {
  mode: 'identify',
  problem: { number: 347, hundreds: 3, tens: 4, units: 7 },
  field: 'units',
  answer: 7,
  options: [2, 7, 5, 9],
};

describe('IdentifyMode', () => {
  it('shows the number, the asked digit and its options', () => {
    const { getByText, getAllByTestId } = render(
      <IdentifyMode round={round} onAnswer={jest.fn()} result="idle" />,
    );

    expect(getByText('347')).toBeTruthy();
    expect(getByText('¿Cuántas unidades tiene?')).toBeTruthy();
    expect(getAllByTestId('identify-option')).toHaveLength(4);
  });

  it('always offers the correct digit among the options', () => {
    const { getByText } = render(
      <IdentifyMode round={round} onAnswer={jest.fn()} result="idle" />,
    );

    expect(getByText('7')).toBeTruthy();
  });

  it('reports true only when the correct digit is pressed', () => {
    const onAnswer = jest.fn();
    const { getByText } = render(
      <IdentifyMode round={round} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(getByText('2'));
    expect(onAnswer).toHaveBeenLastCalledWith(false);

    fireEvent.press(getByText('7'));
    expect(onAnswer).toHaveBeenLastCalledWith(true);
  });

  it('follows the round it is given instead of the first one it rendered', () => {
    const { getByText, rerender, queryByText } = render(
      <IdentifyMode round={round} onAnswer={jest.fn()} result="idle" />,
    );

    const next: IdentifyRound = {
      mode: 'identify',
      problem: { number: 77, hundreds: 0, tens: 7, units: 7 },
      field: 'tens',
      answer: 7,
      options: [1, 7, 3, 4],
    };
    rerender(<IdentifyMode round={next} onAnswer={jest.fn()} result="idle" />);

    expect(getByText('77')).toBeTruthy();
    expect(getByText('¿Cuántas decenas tiene?')).toBeTruthy();
    expect(getByText('7')).toBeTruthy();
    expect(queryByText('2')).toBeNull();
  });
});
