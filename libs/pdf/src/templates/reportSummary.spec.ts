import { buildReportSummary } from './reportSummary';

describe('buildReportSummary', () => {
  it('renders the 3 global stat values', () => {
    const html = buildReportSummary({
      totalSessions: 12,
      totalMinutes: 45,
      avgScore: 82,
      bestScore: 100,
    });

    expect(html).toContain('12');
    expect(html).toContain('45');
    expect(html).toContain('82%');
  });

  it('renders zeros for a profile with no sessions instead of blank/NaN', () => {
    const html = buildReportSummary({
      totalSessions: 0,
      totalMinutes: 0,
      avgScore: 0,
      bestScore: 0,
    });

    expect(html).not.toContain('NaN');
    expect(html).not.toContain('undefined');
  });
});
