describe('getAudioModule', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('returns null when the native expo-audio module is unavailable', () => {
    jest.doMock('expo-audio', () => {
      throw new Error('native module not available');
    });

    const { getAudioModule } = require('./audioModule');

    expect(getAudioModule()).toBeNull();
  });

  it('caches the resolved module across repeated calls', () => {
    const createAudioPlayer = jest.fn();
    const setAudioModeAsync = jest.fn();
    jest.doMock('expo-audio', () => ({ createAudioPlayer, setAudioModeAsync }));

    const { getAudioModule } = require('./audioModule');

    const first = getAudioModule();
    const second = getAudioModule();

    expect(first).toBe(second);
    expect(first).toEqual({ createAudioPlayer, setAudioModeAsync });
  });

  it('allows tests to inject a fake module via __setAudioModuleForTesting', () => {
    const {
      getAudioModule,
      __setAudioModuleForTesting,
    } = require('./audioModule');
    const fake = {
      createAudioPlayer: jest.fn(),
      setAudioModeAsync: jest.fn(),
    } as never;

    __setAudioModuleForTesting(fake);

    expect(getAudioModule()).toBe(fake);
  });

  it('allows tests to force the unavailable case via __setAudioModuleForTesting(null)', () => {
    const {
      getAudioModule,
      __setAudioModuleForTesting,
    } = require('./audioModule');

    __setAudioModuleForTesting(null);

    expect(getAudioModule()).toBeNull();
  });
});
