import React from 'react';
import { render } from '@testing-library/react-native';
import { DailyTipCard } from './DailyTipCard';

describe('DailyTipCard', () => {
  it('renders the given tip text', () => {
    const { getByText } = render(<DailyTipCard tip="Practicá un ratito cada día ⭐" />);

    expect(getByText('Practicá un ratito cada día ⭐')).toBeTruthy();
  });
});
