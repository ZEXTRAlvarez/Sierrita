import React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';
import { PetCard } from './PetCard';
import type { PetState } from '@sierrita/pet';

jest.mock('../../../../components/PetAnimation', () => ({ PetAnimation: () => null }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));

const basePet: PetState = {
  profileId: 'p1',
  petType: 'dragon',
  petName: 'Chispita',
  hunger: 80,
  thirst: 80,
  happiness: 80,
  evolutionStage: 1,
  outfitId: 'none',
  totalXp: 340,
  lastSessionAt: 0,
};

const entranceStyle = {
  opacity: new Animated.Value(1),
  transform: [{ translateY: new Animated.Value(0) }],
};

describe('PetCard', () => {
  it('shows the mood text and evolution stage', () => {
    const { getByText } = render(
      <PetCard
        pet={basePet}
        petType="dragon"
        mood="happy"
        moodCfg={{ text: '¡Estoy de gran humor! ✨', accent: '#4CAF50' }}
        stageName="Niño"
        xpProgress={0.5}
        petBounce={new Animated.Value(0)}
        entranceStyle={entranceStyle}
      />,
    );

    expect(getByText('¡Estoy de gran humor! ✨')).toBeTruthy();
    expect(getByText('Niño')).toBeTruthy();
    expect(getByText('⭐ 340 XP')).toBeTruthy();
  });

  it('omits the need dots when there is no pet yet', () => {
    const { queryAllByTestId } = render(
      <PetCard
        pet={null}
        petType="dragon"
        mood="neutral"
        moodCfg={{ text: 'Listo para una aventura 🌤️', accent: '#FBC02D' }}
        stageName=""
        xpProgress={0}
        petBounce={new Animated.Value(0)}
        entranceStyle={entranceStyle}
      />,
    );

    expect(queryAllByTestId('need-dot')).toHaveLength(0);
  });
});
