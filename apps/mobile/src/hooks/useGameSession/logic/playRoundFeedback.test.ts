import { playRoundFeedback } from './playRoundFeedback';
import { speak, hapticSuccess, hapticError } from '@sierrita/audio';

jest.mock('@sierrita/audio', () => ({
  speak: jest.fn(async () => undefined),
  hapticSuccess: jest.fn(async () => undefined),
  hapticError: jest.fn(async () => undefined),
}));
jest.mock('@sierrita/games', () => ({
  FEEDBACK_CORRECT: ['¡Bien!'],
  FEEDBACK_WRONG: ['¡Casi!'],
  randomFrom: (arr: string[]) => arr[0],
}));

describe('playRoundFeedback', () => {
  beforeEach(() => jest.clearAllMocks());

  it('plays a success haptic and a correct-feedback phrase when correct', async () => {
    await playRoundFeedback(true);

    expect(hapticSuccess).toHaveBeenCalledTimes(1);
    expect(hapticError).not.toHaveBeenCalled();
    expect(speak).toHaveBeenCalledWith('¡Bien!');
  });

  it('plays an error haptic and a wrong-feedback phrase when incorrect', async () => {
    await playRoundFeedback(false);

    expect(hapticError).toHaveBeenCalledTimes(1);
    expect(hapticSuccess).not.toHaveBeenCalled();
    expect(speak).toHaveBeenCalledWith('¡Casi!');
  });
});
