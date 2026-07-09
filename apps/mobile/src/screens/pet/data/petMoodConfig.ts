export interface PetMoodConfig {
  text: string;
  glow: string;
}

export const PET_MOOD_CONFIG: Record<string, PetMoodConfig> = {
  happy: { text: '¡Estoy en mi mejor momento! ✨', glow: '#A5D6A7' },
  neutral: { text: 'Tengo ganas de aventuras 🌤️', glow: '#FFE082' },
  hungry: { text: 'Una rica comida me vendría bien…', glow: '#FFAB91' },
  thirsty: { text: 'Se me secó la garganta… 💧', glow: '#90CAF9' },
  sad: { text: 'Te estuve esperando todo el día 🥺', glow: '#F48FB1' },
};
