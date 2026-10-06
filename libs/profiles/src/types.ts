export type PetType = 'dragon' | 'bunny' | 'dog' | 'cat' | 'rex';

export interface Profile {
  id: string;
  name: string;
  age: 4 | 5 | 6 | 7 | 8 | 9 | 10;
  avatar: PetType;
  createdAt: number;
}
