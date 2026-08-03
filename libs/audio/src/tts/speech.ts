import * as Speech from 'expo-speech';

// Configuración de voz para español latinoamericano
export const VOICE_OPTIONS: Speech.SpeechOptions = {
  language: 'es-419', // código IETF para español latinoamericano
  pitch: 1.2, // voz un poco más aguda, más amigable para niños
  rate: 0.85, // más lento para que entiendan bien
};

// Un único gate para las ~20 llamadas a speak() repartidas por juegos,
// walkthrough y sesión de juego. Vive en el módulo y no en un atom de Jotai
// porque esta lib es agnóstica del framework: la app la sincroniza llamando a
// setVoiceEnabled con la preferencia del perfil activo.
let voiceEnabled = true;

/** Enciende o apaga toda la narración por voz. Al apagarla corta la frase en curso. */
export function setVoiceEnabled(enabled: boolean): void {
  voiceEnabled = enabled;
  if (!enabled) Speech.stop();
}

export function isVoiceEnabled(): boolean {
  return voiceEnabled;
}

export async function speak(
  text: string,
  options?: Partial<Speech.SpeechOptions>,
): Promise<void> {
  Speech.stop();
  if (!voiceEnabled) return;
  Speech.speak(text, { ...VOICE_OPTIONS, ...options });
}

export function stopSpeech(): void {
  Speech.stop();
}

export async function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}
