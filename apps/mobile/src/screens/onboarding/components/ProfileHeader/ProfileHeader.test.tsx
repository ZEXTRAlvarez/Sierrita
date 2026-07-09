import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ProfileHeader } from './ProfileHeader';

describe('ProfileHeader', () => {
  it('hides the back button when not switching profiles', () => {
    const { queryByText } = render(<ProfileHeader isSwitching={false} onBack={jest.fn()} />);

    expect(queryByText('← Volver')).toBeNull();
    expect(queryByText('Tocá tu perfil para entrar')).toBeTruthy();
  });

  it('shows the back button and switch copy while switching profiles', () => {
    const onBack = jest.fn();
    const { getByText } = render(<ProfileHeader isSwitching={true} onBack={onBack} />);

    fireEvent.press(getByText('← Volver'));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(getByText('Elegí un perfil o creá uno nuevo')).toBeTruthy();
  });
});
