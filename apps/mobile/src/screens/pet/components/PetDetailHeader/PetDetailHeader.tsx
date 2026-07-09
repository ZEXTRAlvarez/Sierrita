import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { styles } from './PetDetailHeader.styles';

export interface PetDetailHeaderProps {
  petColor: string;
  petName: string;
  stageName: string;
  totalXp: number;
  onBack: () => void;
}

export function PetDetailHeader({ petColor, petName, stageName, totalXp, onBack }: PetDetailHeaderProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, damping: 14, stiffness: 100, useNativeDriver: true }).start();
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.header,
        { backgroundColor: petColor },
        { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] },
      ]}
    >
      <TouchableOpacity onPress={onBack} hitSlop={16} style={styles.backBtn}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{petName}</Text>
      <Text style={styles.stage}>
        {stageName} · ⭐ {totalXp} XP
      </Text>
    </Animated.View>
  );
}
