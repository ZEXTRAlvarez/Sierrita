import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { StatsSection } from './StatsSection';
import type { GameStat } from '@sierrita/storage';

const gameStats: GameStat[] = [
  { gameId: 'counting', world: 'ocean', sessions: 4, avgScore: 75, bestScore: 100, totalMinutes: 12, lastLevel: 2 },
  { gameId: 'tracing', world: 'jungle', sessions: 2, avgScore: 60, bestScore: 80, totalMinutes: 5, lastLevel: 1 },
];

describe('StatsSection', () => {
  it('shows the global stat summary', () => {
    const { getByText } = renderWithProviders(
      <StatsSection globalStats={{ totalSessions: 6, totalMinutes: 17, avgScore: 70, bestScore: 100 }} gameStats={[]} />,
    );

    expect(getByText('6')).toBeTruthy();
    expect(getByText('17')).toBeTruthy();
    expect(getByText('70%')).toBeTruthy();
  });

  it('hides the per-game breakdown until expanded', () => {
    const { getByText, queryByText } = renderWithProviders(
      <StatsSection globalStats={{ totalSessions: 6, totalMinutes: 17, avgScore: 70, bestScore: 100 }} gameStats={gameStats} />,
    );

    expect(queryByText('🌊 Océano')).toBeNull();

    fireEvent.press(getByText('▼ Ver por juego'));

    expect(getByText('🌊 Océano')).toBeTruthy();
    expect(getByText('🌿 Selva')).toBeTruthy();
  });

  it('groups games under their world and resolves the game title from the registry', () => {
    const { getByText } = renderWithProviders(
      <StatsSection globalStats={{ totalSessions: 6, totalMinutes: 17, avgScore: 70, bestScore: 100 }} gameStats={gameStats} />,
    );

    fireEvent.press(getByText('▼ Ver por juego'));

    expect(getByText('Contar Pececitos')).toBeTruthy();
    expect(getByText('4× · 75% · Niv.2')).toBeTruthy();
  });
});
