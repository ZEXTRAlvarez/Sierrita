import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { activeProfileAtom, activeProfileIdAtom } from '../../../store/atoms';
import { getParentConfig, upsertParentConfig, getProfileStats, getGameStats } from '@sierrita/storage';
import { hashPin } from '@sierrita/parents';
import { buildReportHtml, exportReportPdf } from '@sierrita/pdf';
import type { ParentConfig } from '@sierrita/parents';
import type { GameStat, ProfileStats } from '@sierrita/storage';

export type ExportPdfResult = { ok: true; shared: boolean; uri: string } | { ok: false };

export function useParentDashboard() {
  const profile = useAtomValue(activeProfileAtom);
  const profileId = useAtomValue(activeProfileIdAtom);

  const [parentConfig, setParentConfig] = useState<ParentConfig | null>(null);
  const [globalStats, setGlobalStats] = useState<ProfileStats | null>(null);
  const [gameStats, setGameStats] = useState<GameStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    (async () => {
      const [cfg, gs, gst] = await Promise.all([
        getParentConfig(profileId),
        getProfileStats(profileId),
        getGameStats(profileId),
      ]);
      setParentConfig(cfg);
      setGlobalStats(gs);
      setGameStats(gst);
      setLoading(false);
    })();
  }, [profileId]);

  const unlock = useCallback(async (pin: string) => {
    if (!parentConfig || !profileId) return;
    if (parentConfig.pinHash === '') {
      const updated: ParentConfig = { ...parentConfig, pinHash: await hashPin(pin), updatedAt: Date.now() };
      await upsertParentConfig(updated);
      setParentConfig(updated);
    }
  }, [parentConfig, profileId]);

  const updateConfig = useCallback(async (updated: ParentConfig) => {
    setParentConfig(updated);
    await upsertParentConfig(updated);
  }, []);

  const changePin = useCallback(async (newHash: string) => {
    if (!parentConfig) return;
    const updated: ParentConfig = { ...parentConfig, pinHash: newHash, updatedAt: Date.now() };
    await upsertParentConfig(updated);
    setParentConfig(updated);
  }, [parentConfig]);

  const exportPdf = useCallback(async (): Promise<ExportPdfResult> => {
    if (!profile || !parentConfig || !globalStats) return { ok: false };
    setExporting(true);
    try {
      const date = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const html = buildReportHtml({
        profile: { name: profile.name, age: profile.age },
        globalStats,
        gameStats,
        config: parentConfig,
        date,
      });
      const { uri, shared } = await exportReportPdf(html, `Reporte de ${profile.name}`);
      return { ok: true, shared, uri };
    } catch {
      return { ok: false };
    } finally {
      setExporting(false);
    }
  }, [profile, parentConfig, globalStats, gameStats]);

  return { profile, parentConfig, globalStats, gameStats, loading, exporting, unlock, updateConfig, changePin, exportPdf };
}
