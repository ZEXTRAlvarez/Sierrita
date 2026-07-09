import * as Haptics from 'expo-haptics';
import { hapticSuccess, hapticError, hapticLight } from './haptics';

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
  ImpactFeedbackStyle: { Light: 'light' },
}));

describe('hapticSuccess', () => {
  it('triggers a success notification', async () => {
    await hapticSuccess();

    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('swallows errors instead of throwing (haptics not available on all devices)', async () => {
    (Haptics.notificationAsync as jest.Mock).mockRejectedValueOnce(
      new Error('no haptics'),
    );

    await expect(hapticSuccess()).resolves.toBeUndefined();
  });
});

describe('hapticError', () => {
  it('triggers an error notification', async () => {
    await hapticError();

    expect(Haptics.notificationAsync).toHaveBeenCalledWith('error');
  });

  it('swallows errors instead of throwing', async () => {
    (Haptics.notificationAsync as jest.Mock).mockRejectedValueOnce(
      new Error('no haptics'),
    );

    await expect(hapticError()).resolves.toBeUndefined();
  });
});

describe('hapticLight', () => {
  it('triggers a light impact', async () => {
    await hapticLight();

    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('swallows errors instead of throwing', async () => {
    (Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(
      new Error('no haptics'),
    );

    await expect(hapticLight()).resolves.toBeUndefined();
  });
});
