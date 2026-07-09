import React from 'react';
import { render } from '@testing-library/react-native';
import { WordBlanks } from './WordBlanks';

describe('WordBlanks', () => {
  it('shows fixed letters as-is and blanks as empty when nothing is chosen yet', () => {
    const { getByText, queryByText } = render(
      <WordBlanks word="GATO" blankIndices={[1, 3]} chosen={[null, null]} status="idle" />,
    );

    expect(getByText('G')).toBeTruthy();
    expect(getByText('T')).toBeTruthy();
    expect(queryByText('A')).toBeNull();
    expect(queryByText('O')).toBeNull();
  });

  it('shows the chosen letters in their blank slots', () => {
    const { getByText } = render(
      <WordBlanks word="GATO" blankIndices={[1, 3]} chosen={['A', 'O']} status="idle" />,
    );

    expect(getByText('A')).toBeTruthy();
    expect(getByText('O')).toBeTruthy();
  });

  it('renders one box per letter of the word', () => {
    const { getAllByText } = render(
      <WordBlanks word="SOL" blankIndices={[]} chosen={[]} status="idle" />,
    );

    expect(getAllByText(/[SOL]/)).toHaveLength(3);
  });
});
