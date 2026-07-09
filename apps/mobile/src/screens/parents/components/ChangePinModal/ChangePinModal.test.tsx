import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { verifyPin } from '@sierrita/parents';
import { ChangePinModal } from './ChangePinModal';

jest.mock('@sierrita/parents', () => ({
  verifyPin: jest.fn(),
  hashPin: jest.fn(async (pin: string) => `hash(${pin})`),
}));

describe('ChangePinModal', () => {
  it('skips the verify step when there is no current PIN set', () => {
    const { getByText } = render(<ChangePinModal currentHash="" onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(getByText('Nuevo PIN (mínimo 4 dígitos)')).toBeTruthy();
  });

  it('requires verifying the current PIN before allowing a new one', async () => {
    (verifyPin as jest.Mock).mockResolvedValue(false);
    const { getByText, getByTestId } = render(
      <ChangePinModal currentHash="oldhash" onSave={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(getByText('Ingresá tu PIN actual')).toBeTruthy();
    fireEvent.changeText(getByTestId('change-pin-input'), '0000');
    fireEvent.press(getByText('Siguiente →'));

    await waitFor(() => expect(getByText('PIN incorrecto')).toBeTruthy());
    expect(getByText('Ingresá tu PIN actual')).toBeTruthy(); // still on verify step
  });

  it('calls onSave with the new hash once verify → new → confirm all succeed', async () => {
    (verifyPin as jest.Mock).mockResolvedValue(true);
    const onSave = jest.fn();
    const { getByText, getByTestId } = render(
      <ChangePinModal currentHash="oldhash" onSave={onSave} onCancel={jest.fn()} />,
    );

    fireEvent.changeText(getByTestId('change-pin-input'), '0000');
    fireEvent.press(getByText('Siguiente →'));
    await waitFor(() => expect(getByText('Nuevo PIN (mínimo 4 dígitos)')).toBeTruthy());

    fireEvent.changeText(getByTestId('change-pin-input'), '1234');
    fireEvent.press(getByText('Siguiente →'));
    expect(getByText('Repetí el nuevo PIN')).toBeTruthy();

    fireEvent.changeText(getByTestId('change-pin-input'), '1234');
    fireEvent.press(getByText('Guardar'));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith('hash(1234)'));
  });

  it('calls onCancel when the cancel button is tapped', () => {
    const onCancel = jest.fn();
    const { getByText } = render(<ChangePinModal currentHash="" onSave={jest.fn()} onCancel={onCancel} />);

    fireEvent.press(getByText('Cancelar'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
