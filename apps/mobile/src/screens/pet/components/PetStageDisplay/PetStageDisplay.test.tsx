import React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';
import { PetStageDisplay } from './PetStageDisplay';

jest.mock('../../../../components/PetAnimation', () => ({ PetAnimation: () => null }));

describe('PetStageDisplay', () => {
  it('shows the mood text', () => {
    const { getByText } = render(
      <PetStageDisplay
        petType="dragon"
        mood="happy"
        moodCfg={{ text: '¡Estoy en mi mejor momento! ✨', glow: '#A5D6A7' }}
        bounceY={new Animated.Value(0)}
        actionScale={new Animated.Value(1)}
      />,
    );

    expect(getByText('¡Estoy en mi mejor momento! ✨')).toBeTruthy();
  });
});
