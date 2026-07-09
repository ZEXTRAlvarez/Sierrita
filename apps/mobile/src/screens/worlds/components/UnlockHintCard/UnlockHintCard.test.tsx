import React from 'react';
import { render } from '@testing-library/react-native';
import { UnlockHintCard } from './UnlockHintCard';

describe('UnlockHintCard', () => {
  it('renders the unlock hint text', () => {
    const { getByText } = render(<UnlockHintCard />);

    expect(
      getByText('🔒 Los juegos con candado se desbloquean a medida que crecés'),
    ).toBeTruthy();
  });
});
