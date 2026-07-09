import * as Haptics from 'expo-haptics';

/** Feedback háptico de acierto */
export async function hapticSuccess(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // haptics no disponibles en todos los dispositivos
  }
}

/** Feedback háptico de error */
export async function hapticError(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // haptics no disponibles en todos los dispositivos
  }
}

/** Feedback háptico leve (tap) */
export async function hapticLight(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // haptics no disponibles en todos los dispositivos
  }
}
