import React from 'react';
import { Animated } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { ProfileCard } from './ProfileCard';
import type { Profile } from '../../../../store/atoms';

jest.mock('../../../../components/PetAnimation', () => ({
  PetAnimation: () => null,
}));

const profile: Profile = {
  id: 'p1',
  name: 'Sofía',
  age: 5,
  avatar: 'dragon',
  createdAt: 0,
};

describe('ProfileCard', () => {
  it('shows the profile name and age', () => {
    const { getByText } = render(
      <ProfileCard
        profile={profile}
        anim={new Animated.Value(1)}
        onSelect={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(getByText('Sofía')).toBeTruthy();
    expect(getByText('5 años')).toBeTruthy();
  });

  it('calls onSelect when pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <ProfileCard
        profile={profile}
        anim={new Animated.Value(1)}
        onSelect={onSelect}
        onDelete={jest.fn()}
      />,
    );

    fireEvent.press(getByText('Sofía'));

    expect(onSelect).toHaveBeenCalledWith('p1');
  });

  it('calls onDelete on long press', () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <ProfileCard
        profile={profile}
        anim={new Animated.Value(1)}
        onSelect={jest.fn()}
        onDelete={onDelete}
      />,
    );

    fireEvent(getByText('Sofía'), 'longPress');

    expect(onDelete).toHaveBeenCalledWith('p1', 'Sofía');
  });
});
