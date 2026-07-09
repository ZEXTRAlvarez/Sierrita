import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameScreenHeader } from './GameScreenHeader';

describe('GameScreenHeader', () => {
  it('shows the title and level label', () => {
    const { getByText } = render(
      <GameScreenHeader
        title="Trazos y Letras"
        currentLevel={1}
        color="#4CAF50"
        onBack={jest.fn()}
      />,
    );

    expect(getByText('Trazos y Letras')).toBeTruthy();
    expect(getByText('⭐ Fácil')).toBeTruthy();
  });

  it('calls onBack when the close button is tapped', () => {
    const onBack = jest.fn();
    const { getByText } = render(
      <GameScreenHeader
        title="Trazos y Letras"
        currentLevel={1}
        color="#4CAF50"
        onBack={onBack}
      />,
    );

    fireEvent.press(getByText('✕'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
