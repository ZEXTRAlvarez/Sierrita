import { randomFrom } from '../utils/randomFrom';

export type StoryLength = 'short' | 'medium' | 'long';
export type QuestionKind = 'literal' | 'inferential';

export interface StoryQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  /** literal: the answer is stated directly in the text; inferential: the child has to read between the lines. */
  kind: QuestionKind;
}

export interface StoryEntry {
  title: string;
  emoji: string;
  text: string;
  length: StoryLength;
  questions: StoryQuestion[];
}

// Mini-cuentos en español latinoamericano, vocabulario simple, 3-5 oraciones.
const STORIES: StoryEntry[] = [
  {
    title: 'El Gato Curioso',
    emoji: '🐱',
    length: 'short',
    text: 'Luna es una gata muy curiosa. Un día encontró una caja grande en el jardín. Adentro había un ovillo de lana rojo, y Luna jugó con él toda la tarde.',
    questions: [
      {
        question: '¿Qué encontró Luna en el jardín?',
        options: ['Una caja', 'Un pájaro', 'Un zapato'],
        correctAnswer: 'Una caja',
        kind: 'literal',
      },
    ],
  },
  {
    title: 'La Lluvia de Verano',
    emoji: '🌧️',
    length: 'short',
    text: 'Hoy llovió mucho en el pueblo. Pedro no pudo salir a andar en bicicleta, así que se quedó adentro dibujando un sol gigante. Cuando paró de llover, salió corriendo a saltar en los charcos.',
    questions: [
      {
        question: '¿Por qué Pedro no pudo andar en bicicleta?',
        options: ['Porque llovía', 'Porque se rompió', 'Porque era de noche'],
        correctAnswer: 'Porque llovía',
        kind: 'literal',
      },
    ],
  },
  {
    title: 'El Cumpleaños de Mateo',
    emoji: '🎂',
    length: 'medium',
    text: 'Hoy es el cumpleaños de Mateo y toda su familia vino a festejar. Su mamá preparó una torta de chocolate con velitas azules. Sus amigos le trajeron regalos envueltos en papel brillante. Mateo sopló las velitas y pidió un deseo en secreto, sonriendo de oreja a oreja.',
    questions: [
      {
        question: '¿De qué sabor era la torta?',
        options: ['Chocolate', 'Vainilla', 'Frutilla'],
        correctAnswer: 'Chocolate',
        kind: 'literal',
      },
      {
        question: '¿Cómo se sintió Mateo en su cumpleaños?',
        options: ['Feliz', 'Enojado', 'Aburrido'],
        correctAnswer: 'Feliz',
        kind: 'inferential',
      },
    ],
  },
  {
    title: 'El Tesoro del Bosque',
    emoji: '🌳',
    length: 'medium',
    text: 'En el bosque vivía una ardilla llamada Nuez que buscaba un tesoro escondido. Siguió un mapa viejo que encontró bajo una piedra. El mapa la llevó hasta un árbol hueco, y adentro encontró un montón de bellotas doradas que brillaban al sol.',
    questions: [
      {
        question: '¿Qué encontró Nuez dentro del árbol hueco?',
        options: ['Bellotas doradas', 'Un sombrero', 'Un libro'],
        correctAnswer: 'Bellotas doradas',
        kind: 'literal',
      },
      {
        question: '¿Por qué el mapa era importante para Nuez?',
        options: [
          'Porque la ayudó a encontrar el tesoro',
          'Porque era muy bonito',
          'Porque no le importaba',
        ],
        correctAnswer: 'Porque la ayudó a encontrar el tesoro',
        kind: 'inferential',
      },
    ],
  },
  {
    title: 'La Carrera de Caracoles',
    emoji: '🐌',
    length: 'long',
    text: 'En la laguna se organizó una carrera de caracoles muy especial. Caramelo, el caracol más lento de todos, decidió participar aunque sus amigos se rieron un poco. Mientras los demás caracoles se apuraban y se cansaban rápido, Caramelo avanzaba despacio pero sin detenerse nunca. Al final de la tarde, Caramelo fue el único que llegó a la meta, porque nunca dejó de moverse. Todos aplaudieron sorprendidos y Caramelo sonrió orgulloso.',
    questions: [
      {
        question: '¿Quién ganó la carrera?',
        options: ['Caramelo', 'El caracol más rápido', 'Nadie'],
        correctAnswer: 'Caramelo',
        kind: 'literal',
      },
      {
        question: '¿Por qué ganó Caramelo la carrera?',
        options: [
          'Porque nunca dejó de moverse',
          'Porque era el más rápido',
          'Porque los otros se perdieron',
        ],
        correctAnswer: 'Porque nunca dejó de moverse',
        kind: 'inferential',
      },
    ],
  },
  {
    title: 'El Globo Perdido',
    emoji: '🎈',
    length: 'long',
    text: 'Valentina estaba en el parque sosteniendo un globo amarillo cuando una ráfaga de viento se lo arrancó de la mano. El globo subió cada vez más alto, y Valentina empezó a llorar pensando que lo había perdido para siempre. Su papá la abrazó y le dijo que podían comprar otro globo, pero uno aún más lindo. Caminaron juntos hasta el puesto de globos y Valentina eligió uno con forma de estrella. Al final del día, Valentina ya ni se acordaba del globo amarillo.',
    questions: [
      {
        question: '¿De qué color era el primer globo de Valentina?',
        options: ['Amarillo', 'Verde', 'Rosa'],
        correctAnswer: 'Amarillo',
        kind: 'literal',
      },
      {
        question: '¿Cómo se sintió Valentina al final del cuento?',
        options: ['Contenta', 'Triste', 'Asustada'],
        correctAnswer: 'Contenta',
        kind: 'inferential',
      },
    ],
  },
];

/** Picks a random story whose length is within the given pool. */
export function getStory(lengthPool: StoryLength[]): StoryEntry {
  const pool = STORIES.filter((s) => lengthPool.includes(s.length));
  return randomFrom(pool);
}

/** Picks a random question of the story, preferring the given kinds (falls back to any question if none match). */
export function pickQuestion(
  story: StoryEntry,
  kinds: QuestionKind[],
): StoryQuestion {
  const pool = story.questions.filter((q) => kinds.includes(q.kind));
  return randomFrom(pool.length > 0 ? pool : story.questions);
}
