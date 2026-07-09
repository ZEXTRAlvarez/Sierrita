import type { ReportData } from '../types';
import { WORLD_LABEL } from '@sierrita/parents';

export function buildReportHeader(data: ReportData): string {
  const worldsHtml = data.config.worldsEnabled
    .map((w) => WORLD_LABEL[w])
    .join(', ');

  return `
  <h1>🌿 Sierrita — Reporte de progreso</h1>
  <p class="meta">
    Alumno: <strong>${data.profile.name}</strong> · Edad: ${data.profile.age} años<br/>
    Generado el: ${data.date} · Mundos activos: ${worldsHtml} · Límite de sesión: ${data.config.maxSessionMinutes} min
  </p>`;
}
