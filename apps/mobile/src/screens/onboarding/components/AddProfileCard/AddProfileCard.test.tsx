import React from 'react';
import { Animated } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { AddProfileCard } from './AddProfileCard';

describe('AddProfileCard', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AddProfileCard anim={new Animated.Value(1)} onPress={onPress} />,
    );

    fireEvent.press(getByText('Nuevo perfil'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
