import type { ReportData } from '../types';
import { REPORT_STYLES } from './reportStyles';
import { buildReportHeader } from './reportHeader';
import { buildReportSummary } from './reportSummary';
import { buildReportGameTable } from './reportGameTable';

export function buildReportHtml(data: ReportData): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<style>${REPORT_STYLES}</style>
</head>
<body>
  ${buildReportHeader(data)}
  ${buildReportSummary(data.globalStats)}
  ${buildReportGameTable(data.gameStats)}
  <p class="footer">Generado por Sierrita — App educativa para niños de 4 a 6 años</p>
</body>
</html>`;
}
