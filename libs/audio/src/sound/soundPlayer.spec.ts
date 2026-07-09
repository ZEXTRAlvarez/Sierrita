import { playSound, initAudio } from './soundPlayer';
import { __setAudioModuleForTesting } from './audioModule';

describe('playSound', () => {
  afterEach(() => __setAudioModuleForTesting(undefined));

  it('does nothing when the audio module is unavailable', async () => {
    __setAudioModuleForTesting(null);

    await expect(playSound(1)).resolves.toBeUndefined();
  });

  it('loads and plays the sound, wiring an unload-on-finish callback', async () => {
    const unloadAsync = jest.fn();
    const playAsync = jest.fn();
    let statusCallback: ((status: unknown) => void) | undefined;
    const setOnPlaybackStatusUpdate = jest.fn((cb) => {
      statusCallback = cb;
    });
    const createAsync = jest.fn().mockResolvedValue({
      sound: { playAsync, setOnPlaybackStatusUpdate, unloadAsync },
    });
    __setAudioModuleForTesting({ Sound: { createAsync } } as never);

    await playSound(42);

    expect(createAsync).toHaveBeenCalledWith(42);
    expect(playAsync).toHaveBeenCalled();

    statusCallback?.({ isLoaded: true, didJustFinish: true });
    expect(unloadAsync).toHaveBeenCalled();
  });

  it('swallows errors from a failed load instead of throwing', async () => {
    const createAsync = jest.fn().mockRejectedValue(new Error('boom'));
    __setAudioModuleForTesting({ Sound: { createAsync } } as never);
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    await expect(playSound(1)).resolves.toBeUndefined();

    warnSpy.mockRestore();
  });
});

describe('initAudio', () => {
  afterEach(() => __setAudioModuleForTesting(undefined));

  it('does nothing when the audio module is unavailable', async () => {
    __setAudioModuleForTesting(null);

    await expect(initAudio()).resolves.toBeUndefined();
  });

  it('configures the audio mode when the module is available', async () => {
    const setAudioModeAsync = jest.fn().mockResolvedValue(undefined);
    __setAudioModuleForTesting({ setAudioModeAsync } as never);

    await initAudio();

    expect(setAudioModeAsync).toHaveBeenCalledWith({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  });

  it('swallows errors from a failed audio-mode config', async () => {
    const setAudioModeAsync = jest.fn().mockRejectedValue(new Error('boom'));
    __setAudioModuleForTesting({ setAudioModeAsync } as never);

    await expect(initAudio()).resolves.toBeUndefined();
  });
});
