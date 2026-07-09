export interface PinValidationResult {
  valid: boolean;
  error?: string;
}

const PIN_PATTERN = /^\d+$/;

/** Valida el formato de un PIN antes de hashearlo: solo dígitos, mínimo 4. */
export function validatePinFormat(pin: string): PinValidationResult {
  if (pin.length < 4) return { valid: false, error: 'Mínimo 4 dígitos' };
  if (!PIN_PATTERN.test(pin)) return { valid: false, error: 'El PIN debe ser solo números' };
  return { valid: true };
}
