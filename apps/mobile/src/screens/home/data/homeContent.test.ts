import {
  dailyTip,
  WORLD_CARDS,
  MOOD_BUBBLE,
  type WorldCard,
} from './homeContent';

describe('homeContent', () => {
  it('has exactly one card per world', () => {
    expect(WORLD_CARDS.map((w: WorldCard) => w.id)).toEqual([
      'jungle',
      'ocean',
      'space',
    ]);
  });

  it('has a mood bubble entry for every pet mood', () => {
    expect(Object.keys(MOOD_BUBBLE)).toEqual([
      'happy',
      'neutral',
      'hungry',
      'thirsty',
      'sad',
    ]);
  });

  it('returns the same tip for the same day of the month', () => {
    expect(dailyTip()).toBe(dailyTip());
  });
});
