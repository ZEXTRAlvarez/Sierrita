export interface OutfitDef {
  id: string;
  emoji: string;
  name: string;
  xpRequired: number;
  color: string;
}

export const OUTFITS: OutfitDef[] = [
  { id: 'none', emoji: '🐾', name: 'Natural', xpRequired: 0, color: '#9E9E9E' },
  { id: 'hat', emoji: '🎩', name: 'Sombrero', xpRequired: 50, color: '#5C6BC0' },
  { id: 'crown', emoji: '👑', name: 'Corona', xpRequired: 150, color: '#FBC02D' },
  { id: 'bowtie', emoji: '🎀', name: 'Moño', xpRequired: 300, color: '#E91E63' },
  { id: 'glasses', emoji: '🕶️', name: 'Anteojos', xpRequired: 500, color: '#00BCD4' },
  { id: 'star', emoji: '⭐', name: 'Estrella', xpRequired: 800, color: '#FF9800' },
  { id: 'rainbow', emoji: '🌈', name: 'Arcoíris', xpRequired: 1200, color: '#9C27B0' },
];

export const PET_COLOR: Record<string, string> = {
  dragon: '#FF6F00',
  bunny: '#EC407A',
  dog: '#795548',
  cat: '#FF8F00',
  rex: '#388E3C',
};

export function getOutfit(id: string): OutfitDef {
  return OUTFITS.find((o) => o.id === id) ?? OUTFITS[0];
}
