import { validatePinFormat } from './pinValidation';

describe('validatePinFormat', () => {
  it.each(['', '1', '12', '123'])('rejects a PIN shorter than 4 digits ("%s")', (pin) => {
    const result = validatePinFormat(pin);

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Mínimo 4 dígitos');
  });

  it('rejects a non-numeric PIN of sufficient length', () => {
    const result = validatePinFormat('12a4');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('El PIN debe ser solo números');
  });

  it('accepts a 4-digit numeric PIN', () => {
    expect(validatePinFormat('1234')).toEqual({ valid: true });
  });

  it('accepts a longer numeric PIN', () => {
    expect(validatePinFormat('123456')).toEqual({ valid: true });
  });
});
