import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ActionBtn } from './ActionBtn';

jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));

describe('ActionBtn', () => {
  it('renders the label and calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ActionBtn icon={<Text>🍎</Text>} label="Alimentar" onPress={onPress} colors={['#FFAB91', '#FF7043']} />,
    );

    fireEvent.press(getByText('Alimentar'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
