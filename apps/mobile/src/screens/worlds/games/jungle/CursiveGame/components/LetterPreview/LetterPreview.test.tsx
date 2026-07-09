import React from 'react';
import { render } from '@testing-library/react-native';
import { LetterPreview } from './LetterPreview';

describe('LetterPreview', () => {
  it('shows the print letter as given and the cursive letter lowercased', () => {
    const { getByText } = render(<LetterPreview letter="A" />);

    expect(getByText('A')).toBeTruthy();
    expect(getByText('a')).toBeTruthy();
  });

  it('labels each preview card', () => {
    const { getByText } = render(<LetterPreview letter="M" />);

    expect(getByText('Imprenta')).toBeTruthy();
    expect(getByText('Cursiva')).toBeTruthy();
  });
});
