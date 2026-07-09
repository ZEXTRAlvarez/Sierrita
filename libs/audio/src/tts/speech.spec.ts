import * as Speech from 'expo-speech';
import { speak, stopSpeech, isSpeaking, VOICE_OPTIONS } from './speech';

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
}));

describe('speak', () => {
  beforeEach(() => jest.clearAllMocks());

  it('stops any in-flight speech before starting a new utterance', () => {
    const callOrder: string[] = [];
    (Speech.stop as jest.Mock).mockImplementation(() => callOrder.push('stop'));
    (Speech.speak as jest.Mock).mockImplementation(() => callOrder.push('speak'));

    speak('hola');

    expect(callOrder).toEqual(['stop', 'speak']);
  });

  it('merges the default voice options with call-site overrides', () => {
    speak('hola', { rate: 0.5 });

    expect(Speech.speak).toHaveBeenCalledWith('hola', { ...VOICE_OPTIONS, rate: 0.5 });
  });

  it('uses the default voice options when none are provided', () => {
    speak('hola');

    expect(Speech.speak).toHaveBeenCalledWith('hola', VOICE_OPTIONS);
  });
});

describe('stopSpeech', () => {
  it('delegates to Speech.stop', () => {
    jest.clearAllMocks();
    stopSpeech();

    expect(Speech.stop).toHaveBeenCalledTimes(1);
  });
});

describe('isSpeaking', () => {
  it('delegates to Speech.isSpeakingAsync', async () => {
    (Speech.isSpeakingAsync as jest.Mock).mockResolvedValue(true);

    await expect(isSpeaking()).resolves.toBe(true);
  });
});
