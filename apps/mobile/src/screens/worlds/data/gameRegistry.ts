import type { ComponentType } from 'react';
import TracingGame from '../games/jungle/TracingGame';
import WordsGame from '../games/jungle/WordsGame';
import SentencesGame from '../games/jungle/SentencesGame';
import CursiveGame from '../games/jungle/CursiveGame';
import ReadingGame from '../games/jungle/ReadingGame';
import SynonymsGame from '../games/jungle/SynonymsGame';
import WordClassGame from '../games/jungle/WordClassGame';
import CountingGame from '../games/ocean/CountingGame';
import SumsGame from '../games/ocean/SumsGame';
import CompareGame from '../games/ocean/CompareGame';
import HundredsGame from '../games/ocean/HundredsGame';
import CasitaGame from '../games/ocean/CasitaGame';
import SudokuGame from '../games/ocean/SudokuGame';
import MultiplyGame from '../games/ocean/MultiplyGame';
import FractionsGame from '../games/ocean/FractionsGame';
import ClockGame from '../games/ocean/ClockGame';
import WordProblemsGame from '../games/ocean/WordProblemsGame';
import PatternsGame from '../games/space/PatternsGame';
import MemoryGame from '../games/space/MemoryGame';
import ClassifyGame from '../games/space/ClassifyGame';
import MazeGame from '../games/space/MazeGame';
import OddOneOutGame from '../games/space/OddOneOutGame';
import BalanceGame from '../games/space/BalanceGame';
import BlockCodeGame from '../games/space/BlockCodeGame';
import ChessGame from '../games/space/ChessGame';
import type { GameProps } from '../GameScreen';

export const GAME_COMPONENT: Record<string, ComponentType<GameProps>> = {
  tracing: TracingGame,
  words: WordsGame,
  wordsh: WordsGame,
  wordsc: WordsGame,
  sentences: SentencesGame,
  cursive: CursiveGame,
  reading: ReadingGame,
  synonyms: SynonymsGame,
  wordClasses: WordClassGame,
  counting: CountingGame,
  sums: SumsGame,
  compare: CompareGame,
  hundreds: HundredsGame,
  casita: CasitaGame,
  sudoku: SudokuGame,
  multiply: MultiplyGame,
  fractions: FractionsGame,
  clock: ClockGame,
  wordProblems: WordProblemsGame,
  patterns: PatternsGame,
  memory: MemoryGame,
  classify: ClassifyGame,
  maze: MazeGame,
  oddOneOut: OddOneOutGame,
  balance: BalanceGame,
  blockCode: BlockCodeGame,
  chess: ChessGame,
};

export const WORLD_COLOR: Record<string, string> = {
  jungle: '#4CAF50',
  ocean: '#2196F3',
  space: '#9C27B0',
};
