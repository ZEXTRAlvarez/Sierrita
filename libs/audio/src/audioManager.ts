import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

// expo-av requires native module — guard against missing module in Expo Go / dev environments
let Audio: typeof import('expo-av').Audio | null = null;
try {
  Audio = require('expo-av').Audio;
} catch (_) {
  // native module not available
}

// Configuración de voz para español latinoamericano
const VOICE_OPTIONS: Speech.SpeechOptions = {
  language: 'es-419',   // código IETF para español latinoamericano
  pitch: 1.2,           // voz un poco más aguda, más amigable para niños
  rate: 0.85,           // más lento para que entiendan bien
};

export async function speak(text: string, options?: Partial<Speech.SpeechOptions>): Promise<void> {
  Speech.stop();
  Speech.speak(text, { ...VOICE_OPTIONS, ...options });
}

export function stopSpeech(): void {
  Speech.stop();
}

export async function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}

/** Feedback háptico de acierto */
export async function hapticSuccess(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (_) {/* haptics no disponibles en todos los dispositivos */}
}

/** Feedback háptico de error */
export async function hapticError(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (_) {}
}

/** Feedback háptico leve (tap) */
export async function hapticLight(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (_) {}
}

/** Carga y reproduce un sonido desde assets */
export async function playSound(assetPath: number): Promise<void> {
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
  if (!Audio) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  } catch (_) {}
}

// ─── Frases de instrucción por juego ─────────────────────────────────────────

export const GAME_INSTRUCTIONS: Record<string, string[]> = {
  tracing:   ['¡Seguí el camino con tu dedo!', '¡Trazá la letra!', '¡Vamos, dibujá!'],
  words:     ['¡Completá la palabra!', '¿Qué letra falta?', '¡Pensá bien!'],
  sentences: ['¡Armá la oración!', '¡Ordená las palabras!'],
  cursive:   ['¡Escribí en cursiva!', '¡Seguí la guía!'],
  counting:  ['¿Cuántos hay?', '¡Contá los objetos!', '¡A contar!'],
  sums:      ['¿Cuánto es?', '¡Resolvé la cuenta!', '¡A calcular!'],
  hundreds:  ['¿Cuántas centenas?', '¡Descomponé el número!'],
  compare:   ['¿Cuál es mayor?', '¿Cuál es menor?', '¡Comparalos!'],
  patterns:  ['¿Qué sigue?', '¡Completá la secuencia!', '¿Qué viene después?'],
  memory:    ['¡Encontrá las parejas!', '¡A memorizar!'],
  classify:  ['¡Clasificá los objetos!', '¡Ponelos donde van!'],
  maze:      ['¡Encontrá la salida!', '¡Ayudá a llegar!'],
};

export const FEEDBACK_CORRECT = [
  '¡Muy bien!', '¡Excelente!', '¡Bravo!', '¡Genial!',
  '¡Qué inteligente!', '¡Perfecto!', '¡Eso es!',
];

export const FEEDBACK_WRONG = [
  '¡Casi!', '¡Intentalo de nuevo!', '¡Seguí intentando!',
  '¡No importa, volvé a probar!', '¡Casi lo tenés!',
];

export const FEEDBACK_LEVELUP = [
  '¡Subiste de nivel! ¡Sos increíble!',
  '¡Cada vez más difícil porque sos muy bueno!',
  '¡Nivel nuevo! ¡Lo lograste!',
];

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
