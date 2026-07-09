import { View, Text } from 'react-native';
import { EVOLUTION_STAGES } from '../../data/evolutionStages';
import type { EvolutionStage } from '@sierrita/pet';
import { styles } from './EvolutionTimeline.styles';

export interface EvolutionTimelineProps {
  totalXp: number;
  currentStage: EvolutionStage;
}

export function EvolutionTimeline({ totalXp, currentStage }: EvolutionTimelineProps) {
  return (
    <View style={styles.timeline}>
      {EVOLUTION_STAGES.map((ev, i) => {
        const reached = totalXp >= ev.xp;
        const isCurrent = currentStage === ev.stage;
        return (
          <View key={ev.stage} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: reached ? ev.color : '#E0E0E0' }, isCurrent && styles.dotCurrent]}>
              <Text style={styles.dotEmoji}>{ev.emoji}</Text>
            </View>
            {i < EVOLUTION_STAGES.length - 1 && (
              <View style={[styles.line, { backgroundColor: currentStage > ev.stage ? ev.color : '#E0E0E0' }]} />
            )}
            <View style={styles.info}>
              <Text style={[styles.label, isCurrent && { color: ev.color, fontWeight: '900' }]}>
                {ev.label} {isCurrent ? '← Estás aquí' : ''}
              </Text>
              <Text style={styles.xp}>{ev.xp === 0 ? 'Desde el inicio' : `${ev.xp} XP`}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
