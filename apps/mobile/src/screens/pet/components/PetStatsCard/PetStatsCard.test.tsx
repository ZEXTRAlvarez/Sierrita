import React from 'react';
import { render } from '@testing-library/react-native';
import { PetStatsCard } from './PetStatsCard';
import type { PetState } from '@sierrita/pet';

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { BlurView: View };
});

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

describe('PetStatsCard', () => {
  it('shows the stage name, xp and how much is left to the next stage', () => {
    const { getByText } = render(
      <PetStatsCard petState={basePet} stageName="Niño" xpProgress={0.5} nextXp={160} />,
    );

    expect(getByText('Niño')).toBeTruthy();
    expect(getByText('⭐ 340 XP')).toBeTruthy();
    expect(getByText('Faltan 160 XP para crecer')).toBeTruthy();
  });

  it('hides the xp bar at the max evolution stage', () => {
    const { queryByText } = render(
      <PetStatsCard petState={{ ...basePet, evolutionStage: 3 }} stageName="Adulto" xpProgress={1} nextXp={0} />,
    );

    expect(queryByText(/Faltan/)).toBeNull();
  });
});
