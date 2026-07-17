import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppWalkthrough } from './AppWalkthrough';

describe('AppWalkthrough', () => {
  it('starts on the Inicio step', () => {
    const { getByText } = render(<AppWalkthrough onFinish={jest.fn()} />);

    expect(getByText('Este es tu Inicio')).toBeTruthy();
    expect(getByText('Siguiente')).toBeTruthy();
  });

  it('advances through all steps on each tap and ends with a play CTA', () => {
    const { getByText, getByTestId } = render(
      <AppWalkthrough onFinish={jest.fn()} />,
    );

    fireEvent.press(getByTestId('app-walkthrough-next'));
    expect(getByText('Explorá los Mundos')).toBeTruthy();

    fireEvent.press(getByTestId('app-walkthrough-next'));
    expect(getByText('Cuidá a tu mascota')).toBeTruthy();

    fireEvent.press(getByTestId('app-walkthrough-next'));
    expect(getByText('Zona de Padres')).toBeTruthy();
    expect(getByText('¡Empezar a jugar! 🎮')).toBeTruthy();
  });

  it('calls onFinish when the last step button is pressed', () => {
    const onFinish = jest.fn();
    const { getByTestId } = render(<AppWalkthrough onFinish={onFinish} />);

    fireEvent.press(getByTestId('app-walkthrough-next'));
    fireEvent.press(getByTestId('app-walkthrough-next'));
    fireEvent.press(getByTestId('app-walkthrough-next'));
    expect(onFinish).not.toHaveBeenCalled();

    fireEvent.press(getByTestId('app-walkthrough-next'));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('calls onFinish immediately when "Saltar" is pressed, from any step', () => {
    const onFinish = jest.fn();
    const { getByTestId } = render(<AppWalkthrough onFinish={onFinish} />);

    fireEvent.press(getByTestId('app-walkthrough-next'));
    fireEvent.press(getByTestId('app-walkthrough-skip'));

    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
