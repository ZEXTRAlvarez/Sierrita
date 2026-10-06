import {
  getDistractorPool,
  getSynonymAntonymEntry,
  type SynonymAntonymEntry,
} from '@sierrita/games';

export type Mode = 'synonym' | 'antonym';

export interface Problem {
  mode: Mode;
  entry: SynonymAntonymEntry;
  correct: string;
  options: string[];
}

/** Builds a round: picks a word pair and alternates asking for its synonym or its antonym. */
export function generateProblem(tiers: number[]): Problem {
  const entry = getSynonymAntonymEntry(tiers);
  const mode: Mode = Math.random() < 0.5 ? 'synonym' : 'antonym';
  const correct = mode === 'synonym' ? entry.synonym : entry.antonym;

  const distractorPool = getDistractorPool(tiers, entry);
  const shuffledDistractors = [...distractorPool].sort(
    () => Math.random() - 0.5,
  );
  const options = [correct, ...shuffledDistractors.slice(0, 3)].sort(
    () => Math.random() - 0.5,
  );

  return { mode, entry, correct, options };
}
