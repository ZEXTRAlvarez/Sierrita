import { buildReportHeader } from './reportHeader';
import type { ReportData } from '../types';

const baseData = (): ReportData => ({
  profile: { name: 'Sofía', age: 5 },
  globalStats: { totalSessions: 0, totalMinutes: 0, avgScore: 0, bestScore: 0 },
  gameStats: [],
  config: {
    profileId: 'p1',
    pinHash: '',
    maxSessionMinutes: 30,
    worldsEnabled: ['jungle', 'ocean'],
    updatedAt: 0,
    hasSeenWalkthrough: true,
    fontScale: 'normal',
    highContrast: false,
  },
  date: '01/01/2026',
});

describe('buildReportHeader', () => {
  it('interpolates the profile name, age and date', () => {
    const html = buildReportHeader(baseData());

    expect(html).toContain('Sofía');
    expect(html).toContain('5 años');
    expect(html).toContain('01/01/2026');
  });

  it('lists only the enabled worlds, joined by comma', () => {
    const html = buildReportHeader(baseData());

    expect(html).toContain('🌿 Selva, 🌊 Océano');
    expect(html).not.toContain('🚀 Espacio');
  });

  it('shows the configured session limit', () => {
    const html = buildReportHeader(baseData());

    expect(html).toContain('30 min');
  });
});
