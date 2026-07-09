import { rowToProfile } from './profileRow';

describe('rowToProfile', () => {
  it('maps a raw SQLite row to a Profile', () => {
    const row = {
      id: 'p1',
      name: 'Sofía',
      age: 5,
      avatar: 'dragon',
      created_at: 1700000000,
    };

    expect(rowToProfile(row)).toEqual({
      id: 'p1',
      name: 'Sofía',
      age: 5,
      avatar: 'dragon',
      createdAt: 1700000000,
    });
  });
});
