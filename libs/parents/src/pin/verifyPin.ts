import { hashPin } from './hashPin';

/**
 * Verifica un PIN contra su hash guardado. Un storedHash vacío es el
 * sentinel de "sin PIN configurado" y nunca debe aceptar ningún PIN.
 */
export async function verifyPin(
  pin: string,
  storedHash: string,
): Promise<boolean> {
  if (storedHash === '') return false;
  return (await hashPin(pin)) === storedHash;
}
