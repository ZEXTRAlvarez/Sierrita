import type { ProfileStats } from '@sierrita/storage';

export function buildReportSummary(globalStats: ProfileStats): string {
  return `
  <h2>Resumen global</h2>
  <div class="summary">
    <div class="stat-box"><div class="stat-val">${globalStats.totalSessions}</div><div class="stat-lbl">partidas jugadas</div></div>
    <div class="stat-box"><div class="stat-val">${globalStats.totalMinutes}</div><div class="stat-lbl">minutos jugados</div></div>
    <div class="stat-box"><div class="stat-val">${globalStats.avgScore}%</div><div class="stat-lbl">promedio general</div></div>
  </div>`;
}
