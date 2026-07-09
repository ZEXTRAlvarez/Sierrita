import { closingMessage } from './closingMessage';

describe('closingMessage', () => {
  it('picks a closing line matching the stars earned', () => {
    expect(closingMessage(3)).toBe('¡Tres estrellas! ¡Sos una estrella!');
    expect(closingMessage(2)).toBe('¡Muy bien! ¡Dos estrellas!');
    expect(closingMessage(1)).toBe('¡Lo intentaste muy bien!');
  });
});
