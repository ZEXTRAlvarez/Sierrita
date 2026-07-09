import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WordBank } from './WordBank';

describe('WordBank', () => {
  it('renders one chip per available word, in order', () => {
    const { getAllByTestId, getByText } = render(
      <WordBank available={['EL', 'GATO', 'DUERME']} disabled={false} onPress={jest.fn()} />,
    );

    expect(getAllByTestId('sentence-bank-word')).toHaveLength(3);
    expect(getByText('DUERME')).toBeTruthy();
  });

  it('calls onPress with the tapped word and its index', () => {
    const onPress = jest.fn();
    const { getAllByTestId } = render(
      <WordBank available={['EL', 'GATO']} disabled={false} onPress={onPress} />,
    );

    fireEvent.press(getAllByTestId('sentence-bank-word')[0]);

    expect(onPress).toHaveBeenCalledWith('EL', 0);
  });

  it('renders nothing when there are no available words', () => {
    const { queryAllByTestId } = render(
      <WordBank available={[]} disabled={false} onPress={jest.fn()} />,
    );

    expect(queryAllByTestId('sentence-bank-word')).toHaveLength(0);
  });
});
