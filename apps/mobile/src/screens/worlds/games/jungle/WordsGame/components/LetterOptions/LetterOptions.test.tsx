import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LetterOptions } from './LetterOptions';

describe('LetterOptions', () => {
  it('renders one button per option', () => {
    const { getAllByTestId } = render(
      <LetterOptions options={['A', 'B', 'C']} disabled={false} onPress={jest.fn()} />,
    );

    expect(getAllByTestId('word-letter-option')).toHaveLength(3);
  });

  it('calls onPress with the tapped letter', () => {
    const onPress = jest.fn();
    const { getAllByTestId } = render(
      <LetterOptions options={['A', 'B', 'C']} disabled={false} onPress={onPress} />,
    );

    fireEvent.press(getAllByTestId('word-letter-option')[1]);

    expect(onPress).toHaveBeenCalledWith('B');
  });

  it('disables every button when disabled is true', () => {
    const { getAllByTestId } = render(
      <LetterOptions options={['A', 'B']} disabled onPress={jest.fn()} />,
    );

    for (const btn of getAllByTestId('word-letter-option')) {
      expect(btn.props.accessibilityState?.disabled ?? btn.props.disabled).toBeTruthy();
    }
  });
});
