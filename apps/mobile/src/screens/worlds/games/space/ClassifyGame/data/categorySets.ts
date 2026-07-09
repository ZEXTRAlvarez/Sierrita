export interface CategoryDef {
  label: string;
  items: string[];
}

export const CATEGORY_SETS: Record<string, CategoryDef[]> = {
  color: [
    { label: '🔴 Rojos', items: ['🍎', '🌹', '🍓', '🚒', '❤️', '🌶️'] },
    { label: '🔵 Azules', items: ['🐋', '🫐', '💙', '🔷', '🌊', '🧊'] },
    { label: '🟡 Amarillos', items: ['🌟', '🌻', '🍌', '🌕', '⭐', '🍋'] },
    { label: '🟢 Verdes', items: ['🌿', '🐢', '🍏', '🌳', '🐸', '🥑'] },
  ],
  shape: [
    { label: '🔵 Redondos', items: ['🌕', '⚽', '🍊', '🌍', '🎱', '🪙'] },
    { label: '🔶 Cuadrados/Rectángulos', items: ['📦', '🧱', '📺', '🖥️', '🗃️', '📚'] },
    { label: '⭐ Estrellados', items: ['⭐', '🌟', '✨', '💫', '🌠', '⚡'] },
    { label: '🔺 Triangulares', items: ['🔺', '🏔️', '🎄', '🍕', '🎭', '⛰️'] },
  ],
  size: [
    { label: '🐘 Grandes', items: ['🐘', '🦒', '🐋', '🌳', '🏢', '🚁'] },
    { label: '🐭 Pequeños', items: ['🐭', '🐜', '🐝', '🌸', '🍓', '🔩'] },
  ],
};
