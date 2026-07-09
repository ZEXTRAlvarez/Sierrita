import React from 'react';
import { Animated } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryBins } from './CategoryBins';

const categories = [{ label: 'Rojos' }, { label: 'Azules' }];
const bins = [[{ id: 1, emoji: '🍎', categoryIdx: 0 }], []];

describe('CategoryBins', () => {
  it('renders a bin per category with its placed items, and reports presses', () => {
    const onPressBin = jest.fn();
    const { getByText, getAllByTestId } = render(
      <CategoryBins
        categories={categories}
        bins={bins}
        hasSelection
        bounceAnim={new Animated.Value(1)}
        onPressBin={onPressBin}
      />,
    );

    expect(getByText('Rojos')).toBeTruthy();
    expect(getByText('🍎')).toBeTruthy();

    fireEvent.press(getAllByTestId('classify-bin')[1]);
    expect(onPressBin).toHaveBeenCalledWith(1);
  });

  it('disables bins when there is no selection', () => {
    const onPressBin = jest.fn();
    const { getAllByTestId } = render(
      <CategoryBins
        categories={categories}
        bins={bins}
        hasSelection={false}
        bounceAnim={new Animated.Value(1)}
        onPressBin={onPressBin}
      />,
    );

    fireEvent.press(getAllByTestId('classify-bin')[0]);
    expect(onPressBin).not.toHaveBeenCalled();
  });
});
