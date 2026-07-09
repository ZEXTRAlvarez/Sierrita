describe('getAudioModule', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('returns null when the native expo-av module is unavailable', () => {
    jest.doMock('expo-av', () => {
      throw new Error('native module not available');
    });

    const { getAudioModule } = require('./audioModule');

    expect(getAudioModule()).toBeNull();
  });

  it('caches the resolved module across repeated calls', () => {
    jest.doMock('expo-av', () => ({ Audio: { marker: 'real-audio-module' } }));

    const { getAudioModule } = require('./audioModule');

    const first = getAudioModule();
    const second = getAudioModule();

    expect(first).toBe(second);
    expect(first).toEqual({ marker: 'real-audio-module' });
  });

  it('allows tests to inject a fake module via __setAudioModuleForTesting', () => {
    const { getAudioModule, __setAudioModuleForTesting } = require('./audioModule');
    const fake = { Sound: { createAsync: jest.fn() } } as never;

    __setAudioModuleForTesting(fake);

    expect(getAudioModule()).toBe(fake);
  });

  it('allows tests to force the unavailable case via __setAudioModuleForTesting(null)', () => {
    const { getAudioModule, __setAudioModuleForTesting } = require('./audioModule');

    __setAudioModuleForTesting(null);

    expect(getAudioModule()).toBeNull();
  });
});
