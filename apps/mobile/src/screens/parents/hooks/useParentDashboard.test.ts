import { renderHook, act, waitFor } from '@testing-library/react-native';
import { upsertParentConfig, upsertLearningGoal } from '@sierrita/storage';
import { exportReportPdf } from '@sierrita/pdf';
import { useParentDashboard } from './useParentDashboard';

jest.mock('jotai', () => ({
  useAtomValue: jest.fn((atom) =>
    atom === 'profile' ? { name: 'Sofía', age: 5 } : 'p1',
  ),
  useSetAtom: jest.fn(() => jest.fn()),
}));
jest.mock('../../../store/atoms', () => ({
  activeProfileAtom: 'profile',
  activeProfileIdAtom: 'profileId',
  accessibilityPrefsAtom: 'accessibilityPrefs',
  worldsEnabledAtom: 'worldsEnabled',
}));

const mockConfig = {
  profileId: 'p1',
  pinHash: '',
  maxSessionMinutes: 30,
  worldsEnabled: ['jungle', 'ocean', 'space'],
  updatedAt: 0,
  hasSeenWalkthrough: true,
  fontScale: 'normal',
  highContrast: false,
};
const mockGlobalStats = {
  totalSessions: 3,
  totalMinutes: 20,
  avgScore: 80,
  bestScore: 100,
};
const mockGoal = {
  profileId: 'p1',
  targetSessionsPerWeek: 5,
  updatedAt: 0,
};

jest.mock('@sierrita/storage', () => ({
  getParentConfig: jest.fn(async () => mockConfig),
  upsertParentConfig: jest.fn(async () => undefined),
  getProfileStats: jest.fn(async () => mockGlobalStats),
  getGameStats: jest.fn(async () => []),
  getLearningGoal: jest.fn(async () => mockGoal),
  upsertLearningGoal: jest.fn(async () => undefined),
  countSessionsSince: jest.fn(async () => 2),
}));
jest.mock('@sierrita/parents', () => ({
  hashPin: jest.fn(async (pin: string) => `hash(${pin})`),
}));
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
    expect(result.current.weeklyProgress).toEqual({
      target: 5,
      completed: 2,
    });
  });

  it('unlock() saves a hashed PIN only the first time (pinHash starts empty)', async () => {
    const { result } = renderHook(() => useParentDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.unlock('1234');
    });

    expect(upsertParentConfig).toHaveBeenCalledWith(
      expect.objectContaining({ pinHash: 'hash(1234)' }),
    );
  });

  it('updateGoal() persists the new weekly target for the active profile', async () => {
    const { result } = renderHook(() => useParentDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateGoal(10);
    });

    expect(upsertLearningGoal).toHaveBeenCalledWith(
      expect.objectContaining({ profileId: 'p1', targetSessionsPerWeek: 10 }),
    );
  });

  it('exportPdf() returns ok:false without calling exportReportPdf when data is not loaded yet', async () => {
    const { result } = renderHook(() => useParentDashboard());
    // Call immediately, before the load effect resolves.
    const outcome = await result.current.exportPdf();

    expect(outcome).toEqual({ ok: false });
    expect(exportReportPdf).not.toHaveBeenCalled();
  });
});
