import React from 'react';
import { render } from '@testing-library/react-native';
import { NeedDot } from './NeedDot';

describe('NeedDot', () => {
  it('stays bright (full opacity) when the need is low', () => {
    const { getByTestId } = render(<NeedDot value={20} color="#FF7043" />);

    expect(getByTestId('need-dot').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 1 })]),
    );
  });

  it('dims once the need is comfortably satisfied', () => {
    const { getByTestId } = render(<NeedDot value={80} color="#FF7043" />);

    expect(getByTestId('need-dot').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0.3 })]),
    );
  });
});
