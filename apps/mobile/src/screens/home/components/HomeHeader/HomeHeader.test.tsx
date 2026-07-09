import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeHeader } from './HomeHeader';

describe('HomeHeader', () => {
  it('greets the profile by name', () => {
    const { getByText } = render(
      <HomeHeader profileName="Sofía" onOpenParents={jest.fn()} />,
    );

    expect(getByText('¡Hola, Sofía!')).toBeTruthy();
  });

  it('falls back to a generic greeting when there is no profile name', () => {
    const { getByText } = render(<HomeHeader onOpenParents={jest.fn()} />);

    expect(getByText('¡Hola, amigo!')).toBeTruthy();
  });

  it('calls onOpenParents when the settings button is pressed', () => {
    const onOpenParents = jest.fn();
    const { getByTestId } = render(
      <HomeHeader profileName="Sofía" onOpenParents={onOpenParents} />,
    );

    fireEvent.press(getByTestId('home-header-parent-btn'));

    expect(onOpenParents).toHaveBeenCalledTimes(1);
  });
});
