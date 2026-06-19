import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAtomValue } from 'jotai';
import type { RootStackParamList } from '../../navigation';
import { profilesAtom, activeProfileIdAtom, appReadyAtom } from '../../store/atoms';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width: W, height: H } = Dimensions.get('window');

// Floating star positions (random but seeded visually)
const STARS = [
  { emoji: '⭐', x: 0.1,  y: 0.15, size: 28, delay: 0   },
  { emoji: '🌟', x: 0.85, y: 0.20, size: 36, delay: 200 },
  { emoji: '✨', x: 0.75, y: 0.70, size: 24, delay: 400 },
  { emoji: '⭐', x: 0.15, y: 0.75, size: 20, delay: 100 },
  { emoji: '💫', x: 0.50, y: 0.88, size: 30, delay: 300 },
  { emoji: '🌟', x: 0.90, y: 0.50, size: 22, delay: 600 },
  { emoji: '✨', x: 0.05, y: 0.45, size: 26, delay: 500 },
];

function FloatingStar({ emoji, x, y, size, delay }: {
  emoji: string; x: number; y: number; size: number; delay: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0.8, duration: 600, useNativeDriver: true }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, { toValue: -12, duration: 1800, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 12,  duration: 1800, useNativeDriver: true }),
          ]),
        ),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left: x * W,
        top: y * H,
        fontSize: size,
        opacity,
        transform: [{ translateY }],
      }}
    >
      {emoji}
    </Animated.Text>
  );
}

export default function SplashScreen() {
  const navigation    = useNavigation<Nav>();
  const appReady      = useAtomValue(appReadyAtom);
  const profiles      = useAtomValue(profilesAtom);
  const activeProfileId = useAtomValue(activeProfileIdAtom);

  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const titleY  = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, damping: 10, stiffness: 90, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
      Animated.spring(titleY, { toValue: 0, damping: 14, stiffness: 120, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!appReady) return;
    const timer = setTimeout(() => {
      if (activeProfileId)      navigation.replace('Main');
      else if (profiles.length) navigation.replace('ProfileSelect');
      else                      navigation.replace('Onboarding');
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
      <Animated.View style={[styles.content, {
        transform: [{ scale }],
        opacity,
      }]}>
        <Text style={styles.logo}>🏔️</Text>
      </Animated.View>

      <Animated.View style={[styles.titleBlock, {
        opacity,
        transform: [{ translateY: titleY }],
      }]}>
        <Text style={styles.title}>Sierrita</Text>
        <Text style={styles.subtitle}>¡Aprender es divertido!</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <Dot key={i} delay={i * 200} />
        ))}
      </View>
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scale, { toValue: 1.2, duration: 400, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.6, duration: 400, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.dot, { transform: [{ scale }] }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  circleOuter: {
    position: 'absolute',
    width: W * 1.4,
    height: W * 1.4,
    borderRadius: W * 0.7,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -W * 0.3,
  },
  circleInner: {
    position: 'absolute',
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W * 0.45,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -W * 0.05,
  },
  content: { alignItems: 'center' },
  logo: { fontSize: 108, marginBottom: 0 },
  titleBlock: { alignItems: 'center', marginTop: 8 },
  title: {
    fontSize: 58,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    color: '#A5D6A7',
    marginTop: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    bottom: 60,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
