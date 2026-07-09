import { getAudioModule } from './audioModule';

/** Carga y reproduce un sonido desde assets */
export async function playSound(assetPath: number): Promise<void> {
  const Audio = getAudioModule();
  if (!Audio) return;
  try {
    const { sound } = await Audio.Sound.createAsync(assetPath);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    console.warn('playSound error', e);
  }
}

/** Configura el modo de audio para la app */
export async function initAudio(): Promise<void> {
  const Audio = getAudioModule();
  if (!Audio) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  } catch {
    // config de audio no disponible en este entorno
  }
}
