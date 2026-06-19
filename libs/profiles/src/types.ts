export type PetType = 'dragon' | 'bunny' | 'dog' | 'cat' | 'rex';

export interface Profile {
  id: string;
  name: string;
  age: 4 | 5 | 6;
  avatar: PetType;
  createdAt: number;
}
