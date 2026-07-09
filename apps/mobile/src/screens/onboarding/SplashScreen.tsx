import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAtomValue } from 'jotai';
import type { RootStackParamList } from '../../navigation';
import {
  profilesAtom,
  activeProfileIdAtom,
  appReadyAtom,
} from '../../store/atoms';
import { STARS } from './data/splashStars';
import { useSplashAnimations } from './hooks/useSplashAnimations';
import { FloatingStar } from './components/FloatingStar';
import { LoadingDot } from './components/LoadingDot';
import { styles } from './SplashScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const appReady = useAtomValue(appReadyAtom);
  const profiles = useAtomValue(profilesAtom);
  const activeProfileId = useAtomValue(activeProfileIdAtom);
  const { scale, opacity, titleY } = useSplashAnimations();

  useEffect(() => {
    if (!appReady) return;
    const timer = setTimeout(() => {
      if (activeProfileId) navigation.replace('Main');
      else if (profiles.length) navigation.replace('ProfileSelect');
      else navigation.replace('Onboarding');
    }, 2400);
    return () => clearTimeout(timer);
  }, [appReady, profiles.length, activeProfileId]);

  return (
    <View style={styles.container}>
      {/* Decorative circle layers */}
      <View style={styles.circleOuter} />
      <View style={styles.circleInner} />

      {/* Floating stars */}
      {STARS.map((s, i) => (
        <FloatingStar key={i} {...s} />
      ))}

      {/* Main content */}
      <Animated.View
        style={[styles.content, { transform: [{ scale }], opacity }]}
      >
        <Text style={styles.logo}>🏔️</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.titleBlock,
          { opacity, transform: [{ translateY: titleY }] },
        ]}
      >
        <Text style={styles.title}>Sierrita</Text>
        <Text style={styles.subtitle}>¡Aprender es divertido!</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <LoadingDot key={i} delay={i * 200} />
        ))}
      </View>
    </View>
  );
}
