import { buildReportGameTable } from './reportGameTable';
import type { GameStat } from '@sierrita/storage';

const stat = (overrides: Partial<GameStat> = {}): GameStat => ({
  gameId: 'counting',
  world: 'ocean',
  sessions: 4,
  avgScore: 75,
  bestScore: 100,
  totalMinutes: 12,
  lastLevel: 2,
  ...overrides,
});

describe('buildReportGameTable', () => {
  it('shows a fallback message when there are no games played yet', () => {
    const html = buildReportGameTable([]);

    expect(html).toContain('Sin partidas registradas aún');
    expect(html).not.toContain('<table>');
  });

  it('renders a row with the resolved game title and world label', () => {
    const html = buildReportGameTable([stat()]);

    expect(html).toContain('Contar Pececitos'); // titleEs from the real games registry
    expect(html).toContain('🌊 Océano');
    expect(html).toContain('Nivel 2');
  });

  it('falls back to the raw gameId when the game is not in the registry', () => {
    const html = buildReportGameTable([stat({ gameId: 'does-not-exist' })]);

    expect(html).toContain('does-not-exist');
  });

  it('falls back to the raw world string when it is not a recognized World', () => {
    const html = buildReportGameTable([stat({ world: 'atlantis' })]);

    expect(html).toContain('atlantis');
  });

  it('renders one row per game stat', () => {
    const html = buildReportGameTable([stat({ gameId: 'counting' }), stat({ gameId: 'sums' })]);

    expect(html.match(/<tr>/g)).toHaveLength(3); // header row + 2 data rows
  });
});
