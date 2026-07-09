import type { GameStat } from '@sierrita/storage';
import { getGameConfig } from '@sierrita/games';
import type { World } from '@sierrita/parents';
import { WORLD_LABEL } from '@sierrita/parents';

function gameTitle(gameId: string): string {
  try {
    return getGameConfig(gameId).titleEs;
  } catch {
    return gameId;
  }
}

function worldLabel(world: string): string {
  return WORLD_LABEL[world as World] ?? world;
}

function gameRow(g: GameStat): string {
  return `
    <tr>
      <td>${gameTitle(g.gameId)}</td>
      <td>${worldLabel(g.world)}</td>
      <td>${g.sessions}</td>
      <td>${g.avgScore}%</td>
      <td>${g.bestScore}%</td>
      <td>${g.totalMinutes} min</td>
      <td>Nivel ${g.lastLevel}</td>
    </tr>`;
}

export function buildReportGameTable(gameStats: GameStat[]): string {
  if (gameStats.length === 0) {
    return '<h2>Detalle por juego</h2><p style="color:#AAA">Sin partidas registradas aún.</p>';
  }

  return `
  <h2>Detalle por juego</h2>
  <table>
    <thead>
      <tr>
        <th>Juego</th><th>Mundo</th><th>Partidas</th><th>Promedio</th><th>Mejor</th><th>Tiempo</th><th>Nivel</th>
      </tr>
    </thead>
    <tbody>${gameStats.map(gameRow).join('')}</tbody>
  </table>`;
}
