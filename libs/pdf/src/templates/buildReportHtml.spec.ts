import { buildReportHtml } from './buildReportHtml';
import type { ReportData } from '../types';

const data: ReportData = {
  profile: { name: 'Sofía', age: 5 },
  globalStats: {
    totalSessions: 3,
    totalMinutes: 20,
    avgScore: 80,
    bestScore: 100,
  },
  gameStats: [],
  config: {
    profileId: 'p1',
    pinHash: '',
    maxSessionMinutes: 30,
    worldsEnabled: ['jungle'],
    updatedAt: 0,
    hasSeenWalkthrough: true,
    fontScale: 'normal',
    highContrast: false,
  },
  date: '01/01/2026',
};

describe('buildReportHtml', () => {
  it('produces a well-formed HTML document with all sections present', () => {
    const html = buildReportHtml(data);

    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toContain('<html lang="es">');
    expect(html).toContain('Sofía');
    expect(html).toContain('Resumen global');
    expect(html).toContain('Detalle por juego');
    expect(html).toContain('</html>');
  });
});
