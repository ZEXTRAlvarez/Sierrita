import { useCallback, useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  activeProfileAtom,
  activeProfileIdAtom,
  accessibilityPrefsAtom,
  worldsEnabledAtom,
} from '../../../store/atoms';
import {
  getParentConfig,
  upsertParentConfig,
  getProfileStats,
  getGameStats,
  getLearningGoal,
  upsertLearningGoal,
  countSessionsSince,
} from '@sierrita/storage';
import { hashPin } from '@sierrita/parents';
import { buildReportHtml, exportReportPdf } from '@sierrita/pdf';
import type { ParentConfig, LearningGoal } from '@sierrita/parents';
import type { GameStat, ProfileStats } from '@sierrita/storage';

/** Start of the current week (Monday 00:00 local time), in unix seconds. */
function startOfWeekUnixSeconds(now = new Date()): number {
  const day = now.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return Math.floor(monday.getTime() / 1000);
}

export type ExportPdfResult =
  | { ok: true; shared: boolean; uri: string }
  | { ok: false };

export function useParentDashboard() {
  const profile = useAtomValue(activeProfileAtom);
  const profileId = useAtomValue(activeProfileIdAtom);
  const setAccessibilityPrefs = useSetAtom(accessibilityPrefsAtom);
  const setWorldsEnabled = useSetAtom(worldsEnabledAtom);

  const [parentConfig, setParentConfig] = useState<ParentConfig | null>(null);
  const [globalStats, setGlobalStats] = useState<ProfileStats | null>(null);
  const [gameStats, setGameStats] = useState<GameStat[]>([]);
  const [learningGoal, setLearningGoal] = useState<LearningGoal | null>(null);
  const [weeklySessionCount, setWeeklySessionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    (async () => {
      const [cfg, gs, gst, goal, weeklyCount] = await Promise.all([
        getParentConfig(profileId),
        getProfileStats(profileId),
        getGameStats(profileId),
        getLearningGoal(profileId),
        countSessionsSince(profileId, startOfWeekUnixSeconds()),
      ]);
      setParentConfig(cfg);
      setGlobalStats(gs);
      setGameStats(gst);
      setLearningGoal(goal);
      setWeeklySessionCount(weeklyCount);
      setLoading(false);
    })();
  }, [profileId]);

  const unlock = useCallback(
    async (pin: string) => {
      if (!parentConfig || !profileId) return;
      if (parentConfig.pinHash === '') {
        const updated: ParentConfig = {
          ...parentConfig,
          pinHash: await hashPin(pin),
          updatedAt: Date.now(),
        };
        await upsertParentConfig(updated);
        setParentConfig(updated);
      }
    },
    [parentConfig, profileId],
  );

  const updateConfig = useCallback(
    async (updated: ParentConfig) => {
      setParentConfig(updated);
      setAccessibilityPrefs({
        fontScale: updated.fontScale,
        highContrast: updated.highContrast,
      });
      setWorldsEnabled(updated.worldsEnabled);
      await upsertParentConfig(updated);
    },
    [setAccessibilityPrefs, setWorldsEnabled],
  );

  const updateGoal = useCallback(
    async (targetSessionsPerWeek: number) => {
      if (!profileId) return;
      const updated: LearningGoal = {
        profileId,
        targetSessionsPerWeek,
        updatedAt: Date.now(),
      };
      setLearningGoal(updated);
      await upsertLearningGoal(updated);
    },
    [profileId],
  );

  const changePin = useCallback(
    async (newHash: string) => {
      if (!parentConfig) return;
      const updated: ParentConfig = {
        ...parentConfig,
        pinHash: newHash,
        updatedAt: Date.now(),
      };
      await upsertParentConfig(updated);
      setParentConfig(updated);
    },
    [parentConfig],
  );

  const exportPdf = useCallback(async (): Promise<ExportPdfResult> => {
    if (!profile || !parentConfig || !globalStats) return { ok: false };
    setExporting(true);
    try {
      const date = new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const html = buildReportHtml({
        profile: { name: profile.name, age: profile.age },
        globalStats,
        gameStats,
        config: parentConfig,
        date,
      });
      const { uri, shared } = await exportReportPdf(
        html,
        `Reporte de ${profile.name}`,
      );
      return { ok: true, shared, uri };
    } catch {
      return { ok: false };
    } finally {
      setExporting(false);
    }
  }, [profile, parentConfig, globalStats, gameStats]);

  const weeklyProgress = learningGoal
    ? {
        target: learningGoal.targetSessionsPerWeek,
        completed: weeklySessionCount,
      }
    : null;

  return {
    profile,
    parentConfig,
    globalStats,
    gameStats,
    learningGoal,
    weeklyProgress,
    loading,
    exporting,
    unlock,
    updateConfig,
    updateGoal,
    changePin,
    exportPdf,
  };
}
