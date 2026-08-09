import React from 'react';
import { render } from '@testing-library/react-native';
import { getLetterDef } from '@sierrita/games';
import type { LetterDef } from '@sierrita/games';
import { LetterPreview } from './LetterPreview';

function mustGetLetterDef(letter: string): LetterDef {
  const def = getLetterDef(letter);
  if (!def)
    throw new Error(`No letter def for "${letter}" — test data is out of date`);
  return def;
}

describe('LetterPreview', () => {
  it('renders a print and a cursive glyph preview for the letter', () => {
    const letterDef = mustGetLetterDef('A');
    const { getByTestId } = render(<LetterPreview letterDef={letterDef} />);

    expect(getByTestId('letter-preview-print').props.d).toBe(
      letterDef.guidePath,
    );
    expect(getByTestId('letter-preview-cursive').props.d).toBe(
      letterDef.cursivePath,
    );
  });

  it('labels each preview card', () => {
    const letterDef = mustGetLetterDef('M');
    const { getByText } = render(<LetterPreview letterDef={letterDef} />);

    expect(getByText('Imprenta')).toBeTruthy();
    expect(getByText('Cursiva')).toBeTruthy();
  });

  it('falls back to the print path when a letter has no cursive variant', () => {
    const letterDef = { ...mustGetLetterDef('A'), cursivePath: undefined };
    const { getByTestId } = render(<LetterPreview letterDef={letterDef} />);

    expect(getByTestId('letter-preview-cursive').props.d).toBe(
      letterDef.guidePath,
    );
  });
});
