import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { useGameSession } from '../../hooks/useGameSession';
import { getGameConfig } from '../../../../../libs/games/src/gameRegistry';
import GameResultScreen from '../../components/GameResultScreen';
import { levelLabel } from '../../../../../libs/adaptive/src/adaptiveEngine';

import TracingGame   from './games/jungle/TracingGame';
import WordsGame     from './games/jungle/WordsGame';
import SentencesGame from './games/jungle/SentencesGame';
import CursiveGame   from './games/jungle/CursiveGame';
import CountingGame  from './games/ocean/CountingGame';
import SumsGame      from './games/ocean/SumsGame';
import CompareGame   from './games/ocean/CompareGame';
import HundredsGame  from './games/ocean/HundredsGame';
import PatternsGame  from './games/space/PatternsGame';
import MemoryGame    from './games/space/MemoryGame';
import ClassifyGame  from './games/space/ClassifyGame';
import MazeGame      from './games/space/MazeGame';

const GAME_COMPONENT: Record<string, React.ComponentType<GameProps>> = {
  tracing:   TracingGame,
  words:     WordsGame,
  sentences: SentencesGame,
  cursive:   CursiveGame,
  counting:  CountingGame,
  sums:      SumsGame,
  compare:   CompareGame,
  hundreds:  HundredsGame,
  patterns:  PatternsGame,
  memory:    MemoryGame,
  classify:  ClassifyGame,
  maze:      MazeGame,
};

export interface GameProps {
  difficulty: 1 | 2 | 3;
  params: Record<string, unknown>;
  onRoundComplete: (correct: boolean, responseTimeMs: number, hintsUsed?: number) => Promise<void>;
  onGameFinish: () => void;
  roundCount: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const WORLD_COLOR: Record<string, string> = {
  jungle: '#4CAF50',
  ocean:  '#2196F3',
  space:  '#9C27B0',
};

export default function GameScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<Props['route']>();
  const { worldId, gameId } = route.params;

  const {
    session, difficultyState, summary, isFinished,
    startSession, recordRound, finishSession,
  } = useGameSession();

  useEffect(() => {
    startSession(gameId, worldId);
  }, [gameId, worldId]);

  const handleRoundComplete = useCallback(async (
    correct: boolean,
    responseTimeMs: number,
    hintsUsed = 0,
  ) => {
    await recordRound(correct, responseTimeMs, hintsUsed);
  }, [recordRound]);

  const handleGameFinish = useCallback(async () => {
    await finishSession();
  }, [finishSession]);

  // Pantalla de resultado
  if (isFinished && summary) {
    return (
      <GameResultScreen
        summary={summary}
        onPlayAgain={() => startSession(gameId, worldId)}
        onBack={() => navigation.goBack()}
      />
    );
  }

  if (!session || !difficultyState) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const config = getGameConfig(gameId);
  const GameComponent = GAME_COMPONENT[gameId];
  const color = WORLD_COLOR[worldId] ?? '#4CAF50';

  if (!GameComponent) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Juego "{gameId}" no implementado aún</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const params = config.params(difficultyState.currentLevel);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
          <Text style={styles.headerBack}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.titleEs}</Text>
        <Text style={styles.headerLevel}>{levelLabel(difficultyState.currentLevel)}</Text>
      </View>

      {/* Progreso de rondas */}
      <View style={styles.progressRow}>
        {Array.from({ length: config.roundCount }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < (session.rounds.length)
                ? { backgroundColor: session.rounds[i]?.correct ? color : '#F44336' }
                : { backgroundColor: '#DDD' },
            ]}
          />
        ))}
      </View>

      {/* Juego */}
      <GameComponent
        difficulty={difficultyState.currentLevel}
        params={params}
        onRoundComplete={handleRoundComplete}
        onGameFinish={handleGameFinish}
        roundCount={config.roundCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  loading:   { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 48, paddingBottom: 16,
  },
  headerBack:  { fontSize: 22, color: '#FFF', fontWeight: '700' },
  headerTitle: { fontSize: 18, color: '#FFF', fontWeight: '800', flex: 1, textAlign: 'center' },
  headerLevel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
  progressRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  progressDot: { width: 14, height: 14, borderRadius: 7 },
  errorText:   { fontSize: 18, color: '#888', textAlign: 'center', marginBottom: 24, marginTop: 80 },
  backBtn:     { backgroundColor: '#4CAF50', borderRadius: 16, padding: 16, alignItems: 'center' },
  backBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
