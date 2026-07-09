export interface SplashStar {
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}

// Floating star positions (random but seeded visually)
export const STARS: SplashStar[] = [
  { emoji: '⭐', x: 0.1,  y: 0.15, size: 28, delay: 0   },
  { emoji: '🌟', x: 0.85, y: 0.20, size: 36, delay: 200 },
  { emoji: '✨', x: 0.75, y: 0.70, size: 24, delay: 400 },
  { emoji: '⭐', x: 0.15, y: 0.75, size: 20, delay: 100 },
  { emoji: '💫', x: 0.50, y: 0.88, size: 30, delay: 300 },
  { emoji: '🌟', x: 0.90, y: 0.50, size: 22, delay: 600 },
  { emoji: '✨', x: 0.05, y: 0.45, size: 26, delay: 500 },
];
