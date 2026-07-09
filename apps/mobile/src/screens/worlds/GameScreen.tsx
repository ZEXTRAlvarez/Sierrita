import { useEffect, useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { useGameSession } from '../../hooks/useGameSession';
import { getGameConfig } from '@sierrita/games';
import GameResultScreen from '../../components/GameResultScreen';
import { GAME_COMPONENT, WORLD_COLOR } from './data/gameRegistry';
import { GameScreenHeader } from './components/GameScreenHeader';
import { RoundProgressDots } from './components/RoundProgressDots';
import { styles } from './GameScreen.styles';

export interface GameProps {
  difficulty: 1 | 2 | 3;
  params: Record<string, unknown>;
  onRoundComplete: (correct: boolean, responseTimeMs: number, hintsUsed?: number) => Promise<void>;
  onGameFinish: () => void;
  roundCount: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Props['route']>();
  const { worldId, gameId } = route.params;

  const {
    session, difficultyState, summary, isFinished,
    startSession, recordRound, finishSession,
  } = useGameSession();

  useEffect(() => {
    startSession(gameId, worldId);
  }, [gameId, worldId]);

  const handleRoundComplete = useCallback(
    async (correct: boolean, responseTimeMs: number, hintsUsed = 0) => {
      await recordRound(correct, responseTimeMs, hintsUsed);
    },
    [recordRound],
  );

  const handleGameFinish = useCallback(async () => {
    await finishSession();
  }, [finishSession]);

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

  return (
    <View style={styles.container}>
      <GameScreenHeader title={config.titleEs} currentLevel={difficultyState.currentLevel} color={color} onBack={() => navigation.goBack()} />
      <RoundProgressDots roundCount={config.roundCount} rounds={session.rounds} color={color} />
      <GameComponent
        difficulty={difficultyState.currentLevel}
        params={config.params(difficultyState.currentLevel)}
        onRoundComplete={handleRoundComplete}
        onGameFinish={handleGameFinish}
        roundCount={config.roundCount}
      />
    </View>
  );
}
