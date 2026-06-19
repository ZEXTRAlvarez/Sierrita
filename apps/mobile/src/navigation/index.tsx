import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAtomValue } from 'jotai';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconAnimation } from '../components/IconAnimation';
import type { IconAnimationName } from '../components/IconAnimation';
import { activeProfileIdAtom } from '../store/atoms';
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import ProfileSelectScreen from '../screens/onboarding/ProfileSelectScreen';
import HomeScreen from '../screens/home/HomeScreen';
import WorldsScreen from '../screens/worlds/WorldsScreen';
import PetScreen from '../screens/pet/PetScreen';
import ParentsScreen from '../screens/parents/ParentsScreen';
import GameScreen from '../screens/worlds/GameScreen';
import PetDetailScreen from '../screens/pet/PetDetailScreen';

// ─── Route param types ────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  ProfileSelect: undefined;
  Main: undefined;
  Game: { worldId: string; gameId: string };
  PetDetail: undefined;
  Parents: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Worlds: undefined;
  Pet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function VideoTabIcon({ name, focused }: { name: IconAnimationName; focused: boolean }) {
  return (
    <IconAnimation
      name={name}
      size={focused ? 42 : 36}
      style={{ opacity: focused ? 1 : 0.55 }}
    />
  );
}

function PawTabIcon({ focused }: { focused: boolean }) {
  return (
    <IconAnimation
      name="paw"
      size={focused ? 28 : 24}
      style={{ opacity: focused ? 1 : 0.55 }}
    />
  );
}

function MainTabs() {
  // La app dibuja edge-to-edge (Android), así que la barra de pestañas debe
  // sumar el inset inferior para no quedar tapada por los botones de
  // navegación del sistema (gestos / barra virtual).
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 72 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 6,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#EEE',
          elevation: 12,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800', marginTop: 2 },
        tabBarActiveTintColor:   '#2E7D32',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <VideoTabIcon name="mano" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Worlds"
        component={WorldsScreen}
        options={{
          title: 'Mundos',
          tabBarIcon: ({ focused }) => <VideoTabIcon name="mundo" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Pet"
        component={PetScreen}
        options={{
          title: 'Mascota',
          tabBarIcon: ({ focused }) => <PawTabIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const activeProfileId = useAtomValue(activeProfileIdAtom);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        {/* Onboarding y ProfileSelect quedan siempre disponibles: además del
            arranque en frío, se usan para crear/cambiar de perfil desde la
            Zona de Padres aunque ya haya un perfil activo. */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} />
        {activeProfileId && (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen name="PetDetail" component={PetDetailScreen} />
            <Stack.Screen name="Parents" component={ParentsScreen} options={{ animation: 'slide_from_bottom' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
