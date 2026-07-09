import React from 'react';
import { render } from '@testing-library/react-native';
import { Stat } from './Stat';

describe('Stat', () => {
  it('renders the label and value', () => {
    const { getByText } = render(<Stat label="XP ganado" value="+40 ⭐" />);

    expect(getByText('XP ganado')).toBeTruthy();
    expect(getByText('+40 ⭐')).toBeTruthy();
  });
});
