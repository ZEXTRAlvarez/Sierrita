import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { verifyPin } from '@sierrita/parents';
import { PinGate } from './PinGate';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));
jest.mock('@sierrita/parents', () => ({ verifyPin: jest.fn() }));

describe('PinGate', () => {
  it('shows setup copy and requires at least 4 digits before advancing', async () => {
    const onSuccess = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <PinGate isSetup storedHash="" onSuccess={onSuccess} />,
    );

    expect(getByText('Creá tu PIN de padre/madre')).toBeTruthy();

    fireEvent.press(getByText('Siguiente →'));
    expect(getByText('Mínimo 4 dígitos')).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();

    fireEvent.changeText(getByPlaceholderText('• • • •'), '1234');
    fireEvent.press(getByText('Siguiente →'));
    expect(getByText('Repetí el PIN')).toBeTruthy();
  });

  it('rejects mismatched confirmation during setup', () => {
    const onSuccess = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <PinGate isSetup storedHash="" onSuccess={onSuccess} />,
    );

    fireEvent.changeText(getByPlaceholderText('• • • •'), '1234');
    fireEvent.press(getByText('Siguiente →'));
    fireEvent.changeText(getByPlaceholderText('• • • •'), '9999');
    fireEvent.press(getByText('Crear PIN'));

    expect(getByText('Los PINs no coinciden')).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('calls onSuccess once setup PINs match', () => {
    const onSuccess = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <PinGate isSetup storedHash="" onSuccess={onSuccess} />,
    );

    fireEvent.changeText(getByPlaceholderText('• • • •'), '1234');
    fireEvent.press(getByText('Siguiente →'));
    fireEvent.changeText(getByPlaceholderText('• • • •'), '1234');
    fireEvent.press(getByText('Crear PIN'));

    expect(onSuccess).toHaveBeenCalledWith('1234');
  });

  it('unlock mode: shows an error and clears the field on a wrong PIN', async () => {
    (verifyPin as jest.Mock).mockResolvedValue(false);
    const onSuccess = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <PinGate isSetup={false} storedHash="somehash" onSuccess={onSuccess} />,
    );

    fireEvent.changeText(getByPlaceholderText('• • • •'), '0000');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() => expect(getByText('PIN incorrecto')).toBeTruthy());
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('unlock mode: calls onSuccess on a correct PIN', async () => {
    (verifyPin as jest.Mock).mockResolvedValue(true);
    const onSuccess = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <PinGate isSetup={false} storedHash="somehash" onSuccess={onSuccess} />,
    );

    fireEvent.changeText(getByPlaceholderText('• • • •'), '1234');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('1234'));
  });
});
