import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { TamaguiProvider } from '@tamagui/core';
import { Provider as JotaiProvider, useSetAtom, useAtom } from 'jotai';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import tamaguiConfig from '../theme';
import { AppNavigator } from '../navigation';
import { getDatabase, getAllProfiles } from '@sierrita/storage';
import {
  profilesAtom,
  activeProfileIdAtom,
  appReadyAtom,
} from '../store/atoms';

SplashScreen.preventAutoHideAsync();

function AppInit({ children }: { children: React.ReactNode }) {
  const setProfiles = useSetAtom(profilesAtom);
  const [activeProfileId, setActiveProfileId] = useAtom(activeProfileIdAtom);
  const [, setAppReady] = useAtom(appReadyAtom);

  useEffect(() => {
    async function init() {
      try {
        await getDatabase();
        const profiles = await getAllProfiles();
        setProfiles(profiles);
        if (profiles.length === 1 && !activeProfileId) {
          setActiveProfileId(profiles[0].id);
        }
      } catch (e) {
        console.error('DB init error', e);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}

export const App = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <JotaiProvider>
        <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
          <SafeAreaProvider>
            <AppInit>
              <React.Suspense fallback={<LoadingScreen />}>
                <AppNavigator />
              </React.Suspense>
            </AppInit>
          </SafeAreaProvider>
        </TamaguiProvider>
      </JotaiProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
});

export default App;
