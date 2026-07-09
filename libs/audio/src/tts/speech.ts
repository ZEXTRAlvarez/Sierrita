import * as Speech from 'expo-speech';

// Configuración de voz para español latinoamericano
export const VOICE_OPTIONS: Speech.SpeechOptions = {
  language: 'es-419', // código IETF para español latinoamericano
  pitch: 1.2, // voz un poco más aguda, más amigable para niños
  rate: 0.85, // más lento para que entiendan bien
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
