import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WordTray } from './WordTray';

describe('WordTray', () => {
  it('shows a placeholder when no words are placed yet', () => {
    const { getByText, queryAllByTestId } = render(
      <WordTray
        placed={[]}
        status="idle"
        disabled={false}
        onRemove={jest.fn()}
      />,
    );

    expect(getByText('Tocá las palabras de abajo')).toBeTruthy();
    expect(queryAllByTestId('sentence-placed-word')).toHaveLength(0);
  });

  it('renders one chip per placed word, in order', () => {
    const { getAllByTestId, getByText } = render(
      <WordTray
        placed={['EL', 'GATO']}
        status="idle"
        disabled={false}
        onRemove={jest.fn()}
      />,
    );

    expect(getAllByTestId('sentence-placed-word')).toHaveLength(2);
    expect(getByText('EL')).toBeTruthy();
    expect(getByText('GATO')).toBeTruthy();
  });

  it('calls onRemove with the tapped word and its index', () => {
    const onRemove = jest.fn();
    const { getAllByTestId } = render(
      <WordTray
        placed={['EL', 'GATO']}
        status="idle"
        disabled={false}
        onRemove={onRemove}
      />,
    );

    fireEvent.press(getAllByTestId('sentence-placed-word')[1]);

    expect(onRemove).toHaveBeenCalledWith('GATO', 1);
  });
});
