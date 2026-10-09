import React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';
import { WaterContainer } from './WaterContainer';

describe('WaterContainer', () => {
  it('renders the container and the item', () => {
    const { getByTestId } = render(
      <WaterContainer emoji="🍎" translateY={new Animated.Value(0)} />,
    );

    expect(getByTestId('water-container')).toBeTruthy();
    expect(getByTestId('water-item')).toBeTruthy();
  });
});
