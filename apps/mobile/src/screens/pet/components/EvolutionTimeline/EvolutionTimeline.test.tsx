import React from 'react';
import { render } from '@testing-library/react-native';
import { EvolutionTimeline } from './EvolutionTimeline';

describe('EvolutionTimeline', () => {
  it('renders all 4 evolution stages', () => {
    const { getByText } = render(<EvolutionTimeline totalXp={0} currentStage={0} />);

    expect(getByText(/Bebé/)).toBeTruthy();
    expect(getByText(/Niño/)).toBeTruthy();
    expect(getByText(/Joven/)).toBeTruthy();
    expect(getByText(/Adulto/)).toBeTruthy();
  });

  it('marks the current stage with a pointer', () => {
    const { getByText } = render(<EvolutionTimeline totalXp={200} currentStage={1} />);

    expect(getByText(/Niño ← Estás aquí/)).toBeTruthy();
  });

  it('shows "Desde el inicio" for the 0-xp baby stage instead of "0 XP"', () => {
    const { getByText } = render(<EvolutionTimeline totalXp={0} currentStage={0} />);

    expect(getByText('Desde el inicio')).toBeTruthy();
  });
});
