// Categorías bien diferenciadas entre sí: cualquier par de categorías
// distintas produce un intruso obvio (dificultad 1 y 2).
export const CATEGORIES: Record<string, string[]> = {
  animals: ['🐶', '🐱', '🐰', '🐻', '🦁', '🐵', '🐮', '🐷'],
  fruits: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉', '🍍', '🥝'],
  vehicles: ['🚗', '🚌', '🚲', '🚂', '✈️', '🚤', '🚁', '🚜'],
  clothes: ['👕', '👖', '👗', '🧦', '🧥', '👟', '🧢', '🧤'],
  instruments: ['🎸', '🥁', '🎺', '🎹', '🎻', '🪘', '🪗', '🎷'],
  furniture: ['🪑', '🛏️', '🛋️', '🚪', '🪟', '🗄️', '🧺', '🪞'],
};

// Pares de atributo dentro de un mismo dominio (todos son animales), para la
// dificultad alta: el intruso ya no se distingue por categoría sino por un
// atributo más sutil.
export const ATTRIBUTE_PAIRS: Array<[string[], string[]]> = [
  [
    ['🐦', '🦋', '🐝', '🦆', '🦉', '🦇'], // vuelan
    ['🐶', '🐱', '🐰', '🐻', '🐮', '🐷'], // no vuelan
  ],
  [
    ['🐟', '🐬', '🐳', '🦈', '🐙', '🦑'], // viven en el agua
    ['🐶', '🐱', '🐰', '🦁', '🐵', '🐴'], // viven en tierra
  ],
];
