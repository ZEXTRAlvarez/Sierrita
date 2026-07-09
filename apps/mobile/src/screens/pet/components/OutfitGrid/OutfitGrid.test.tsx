import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { OutfitGrid } from './OutfitGrid';

describe('OutfitGrid', () => {
  it('renders every outfit', () => {
    const { getByText } = render(
      <OutfitGrid totalXp={0} selectedOutfit="none" onSelect={jest.fn()} />,
    );

    expect(getByText('Natural')).toBeTruthy();
    expect(getByText('Arcoíris')).toBeTruthy();
  });

  it('shows a lock badge with the required XP for outfits not yet unlocked', () => {
    const { getByText } = render(
      <OutfitGrid totalXp={0} selectedOutfit="none" onSelect={jest.fn()} />,
    );

    expect(getByText('🔒 50 XP')).toBeTruthy();
  });

  it('calls onSelect when an unlocked outfit is tapped', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <OutfitGrid totalXp={100} selectedOutfit="none" onSelect={onSelect} />,
    );

    fireEvent.press(getByText('Sombrero'));

    expect(onSelect).toHaveBeenCalledWith('hat');
  });

  it('does not call onSelect for a locked outfit', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <OutfitGrid totalXp={0} selectedOutfit="none" onSelect={onSelect} />,
    );

    fireEvent.press(getByText('Sombrero'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('marks the selected outfit with a checkmark badge', () => {
    const { getByText } = render(
      <OutfitGrid totalXp={0} selectedOutfit="none" onSelect={jest.fn()} />,
    );

    expect(getByText('✓')).toBeTruthy();
  });
});
