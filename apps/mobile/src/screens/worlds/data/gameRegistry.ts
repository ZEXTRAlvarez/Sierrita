import type { ComponentType } from 'react';
import TracingGame from '../games/jungle/TracingGame';
import WordsGame from '../games/jungle/WordsGame';
import SentencesGame from '../games/jungle/SentencesGame';
import CursiveGame from '../games/jungle/CursiveGame';
import CountingGame from '../games/ocean/CountingGame';
import SumsGame from '../games/ocean/SumsGame';
import CompareGame from '../games/ocean/CompareGame';
import HundredsGame from '../games/ocean/HundredsGame';
import CasitaGame from '../games/ocean/CasitaGame';
import PatternsGame from '../games/space/PatternsGame';
import MemoryGame from '../games/space/MemoryGame';
import ClassifyGame from '../games/space/ClassifyGame';
import MazeGame from '../games/space/MazeGame';
import OddOneOutGame from '../games/space/OddOneOutGame';
import BalanceGame from '../games/space/BalanceGame';
import type { GameProps } from '../GameScreen';

export const GAME_COMPONENT: Record<string, ComponentType<GameProps>> = {
  tracing: TracingGame,
  words: WordsGame,
  wordsh: WordsGame,
  wordsc: WordsGame,
  sentences: SentencesGame,
  cursive: CursiveGame,
  counting: CountingGame,
  sums: SumsGame,
  compare: CompareGame,
  hundreds: HundredsGame,
  casita: CasitaGame,
  patterns: PatternsGame,
  memory: MemoryGame,
  classify: ClassifyGame,
  maze: MazeGame,
  oddOneOut: OddOneOutGame,
  balance: BalanceGame,
};

export const WORLD_COLOR: Record<string, string> = {
  jungle: '#4CAF50',
  ocean: '#2196F3',
  space: '#9C27B0',
};
