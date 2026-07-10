import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CasitaIntro } from './CasitaIntro';

describe('CasitaIntro', () => {
  it('starts on the welcome step with the tens/units demo and no carry badge yet', () => {
    const { getByText, queryByText, queryByTestId } = render(
      <CasitaIntro onFinish={jest.fn()} />,
    );

    expect(getByText('¡Bienvenido a la casita! 🏠')).toBeTruthy();
    expect(queryByText('Me llevo 1 👈')).toBeNull();
    expect(queryByTestId('casita-intro-palitos')).toBeNull();
    expect(getByText('Siguiente')).toBeTruthy();
  });

  it('regression: renders tens on the left and units on the right, like the real casita', () => {
    const { toJSON } = render(<CasitaIntro onFinish={jest.fn()} />);

    // Compare positions in the serialized tree instead of React instances
    // directly — asserting on live ReactTestInstance/fiber objects can make
    // Jest's failure-diff formatter hang on their large, cyclic structure.
    const tree = JSON.stringify(toJSON());
    const tensIndex = tree.indexOf('casita-intro-tens');
    const unitsIndex = tree.indexOf('casita-intro-units');

    expect(tensIndex).toBeGreaterThan(-1);
    expect(unitsIndex).toBeGreaterThan(-1);
    expect(tensIndex).toBeLessThan(unitsIndex);
  });

  it('advances through the steps on each tap, showing the carry badge and the sticks preview', () => {
    const { getByText, getByTestId, queryByText } = render(
      <CasitaIntro onFinish={jest.fn()} />,
    );

    fireEvent.press(getByTestId('casita-intro-next')); // -> units step
    expect(getByText('Primero, las unidades 👉')).toBeTruthy();
    expect(queryByText('Me llevo 1 👈')).toBeNull();

    fireEvent.press(getByTestId('casita-intro-next')); // -> carry step
    expect(getByText('¡Nos llevamos 1! ➡️')).toBeTruthy();
    expect(getByText('Me llevo 1 👈')).toBeTruthy();

    fireEvent.press(getByTestId('casita-intro-next')); // -> palitos step
    expect(getByText('¿Te cuesta contar? 🤏')).toBeTruthy();
    expect(getByTestId('casita-intro-palitos')).toBeTruthy();
    expect(getByText('¡A jugar! 🎮')).toBeTruthy();
  });

  it('calls onFinish when the last step button is pressed', () => {
    const onFinish = jest.fn();
    const { getByTestId } = render(<CasitaIntro onFinish={onFinish} />);

    fireEvent.press(getByTestId('casita-intro-next'));
    fireEvent.press(getByTestId('casita-intro-next'));
    fireEvent.press(getByTestId('casita-intro-next'));

    expect(onFinish).not.toHaveBeenCalled();

    fireEvent.press(getByTestId('casita-intro-next'));

    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
