import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import {
  getStory,
  pickQuestion,
  type QuestionKind,
  type StoryEntry,
  type StoryLength,
  type StoryQuestion,
} from '@sierrita/games';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { styles } from './ReadingGame.styles';

type Phase = 'story' | 'question';

export default function ReadingGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const lengthPool = (params.lengthPool as StoryLength[]) || ['short'];
  const kinds = (params.kinds as QuestionKind[]) || ['literal'];

  const [story, setStory] = useState<StoryEntry | null>(null);
  const [question, setQuestion] = useState<StoryQuestion | null>(null);
  const [phase, setPhase] = useState<Phase>('story');

  const startRound = useCallback(() => {
    const s = getStory(lengthPool);
    const q = pickQuestion(s, kinds);
    setStory(s);
    setQuestion(q);
    setPhase('story');
    speak(s.text);
  }, [lengthPool, kinds]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleListenAgain() {
    if (story) speak(story.text);
  }

  function handleContinue() {
    setPhase('question');
    if (question) speak(question.question);
  }

  function handleAnswer(option: string) {
    if (!question || result !== 'idle') return;
    submitAnswer(option === question.correctAnswer);
  }

  if (!story || !question) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      {phase === 'story' ? (
        <View style={styles.storyBox}>
          <Text style={styles.emoji}>{story.emoji}</Text>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.storyText}>{story.text}</Text>
          <View style={styles.storyActions}>
            <TouchableOpacity
              testID="reading-listen-again"
              style={styles.listenBtn}
              onPress={handleListenAgain}
            >
              <Text style={styles.listenText}>🔊 Escuchar de nuevo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="reading-continue"
              style={styles.continueBtn}
              onPress={handleContinue}
            >
              <Text style={styles.continueText}>Ya leí, ¡seguir!</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{question.question}</Text>
          <View style={styles.optionsColumn}>
            {question.options.map((opt) => (
              <TouchableOpacity
                key={opt}
                testID="reading-option"
                style={[
                  styles.optionBtn,
                  result !== 'idle' &&
                    opt === question.correctAnswer &&
                    styles.correctBtn,
                ]}
                onPress={() => handleAnswer(opt)}
                disabled={result !== 'idle'}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! La respuesta era: {question.correctAnswer}
        </Text>
      )}
    </View>
  );
}
