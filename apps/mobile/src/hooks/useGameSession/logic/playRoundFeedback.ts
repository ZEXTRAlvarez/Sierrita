import { speak, hapticSuccess, hapticError } from '@sierrita/audio';
import { FEEDBACK_CORRECT, FEEDBACK_WRONG, randomFrom } from '@sierrita/games';

/** Immediate haptic + spoken feedback right after a round is answered. */
export async function playRoundFeedback(correct: boolean): Promise<void> {
  if (correct) {
    await hapticSuccess();
    speak(randomFrom(FEEDBACK_CORRECT));
  } else {
    await hapticError();
    speak(randomFrom(FEEDBACK_WRONG));
  }
}
