import { renderHook, act, waitFor } from '@testing-library/react-native';
import { upsertParentConfig } from '@sierrita/storage';
import { exportReportPdf } from '@sierrita/pdf';
import { useParentDashboard } from './useParentDashboard';

jest.mock('jotai', () => ({
  useAtomValue: jest.fn((atom) => (atom === 'profile' ? { name: 'Sofía', age: 5 } : 'p1')),
}));
jest.mock('../../../store/atoms', () => ({
  activeProfileAtom: 'profile',
  activeProfileIdAtom: 'profileId',
}));

const mockConfig = {
  profileId: 'p1',
  pinHash: '',
  maxSessionMinutes: 30,
  worldsEnabled: ['jungle', 'ocean', 'space'],
  updatedAt: 0,
};
const mockGlobalStats = { totalSessions: 3, totalMinutes: 20, avgScore: 80, bestScore: 100 };

jest.mock('@sierrita/storage', () => ({
  getParentConfig: jest.fn(async () => mockConfig),
  upsertParentConfig: jest.fn(async () => undefined),
  getProfileStats: jest.fn(async () => mockGlobalStats),
  getGameStats: jest.fn(async () => []),
}));
jest.mock('@sierrita/parents', () => ({ hashPin: jest.fn(async (pin: string) => `hash(${pin})`) }));
jest.mock('@sierrita/pdf', () => ({
  buildReportHtml: jest.fn(() => '<html></html>'),
  exportReportPdf: jest.fn(async () => ({ uri: 'file://r.pdf', shared: true })),
}));

describe('useParentDashboard', () => {
  it('loads config, global stats and game stats for the active profile', async () => {
    const { result } = renderHook(() => useParentDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.parentConfig).toEqual(mockConfig);
    expect(result.current.globalStats).toEqual(mockGlobalStats);
  });

  it('unlock() saves a hashed PIN only the first time (pinHash starts empty)', async () => {
    const { result } = renderHook(() => useParentDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.unlock('1234');
    });

    expect(upsertParentConfig).toHaveBeenCalledWith(expect.objectContaining({ pinHash: 'hash(1234)' }));
  });

  it('exportPdf() returns ok:false without calling exportReportPdf when data is not loaded yet', async () => {
    const { result } = renderHook(() => useParentDashboard());
    // Call immediately, before the load effect resolves.
    const outcome = await result.current.exportPdf();

    expect(outcome).toEqual({ ok: false });
    expect(exportReportPdf).not.toHaveBeenCalled();
  });
});
