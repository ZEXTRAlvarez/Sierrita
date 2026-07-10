import { getAudioModule } from './audioModule';

/** Carga y reproduce un sonido desde assets */
export async function playSound(assetPath: number): Promise<void> {
  const audio = getAudioModule();
  if (!audio) return;
  try {
    const player = audio.createAudioPlayer(assetPath);
    player.play();
    player.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded && status.didJustFinish) {
        player.remove();
      }
    });
  } catch (e) {
    console.warn('playSound error', e);
  }
}

/** Configura el modo de audio para la app */
export async function initAudio(): Promise<void> {
  const audio = getAudioModule();
  if (!audio) return;
  try {
    await audio.setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  } catch {
    // config de audio no disponible en este entorno
  }
}
