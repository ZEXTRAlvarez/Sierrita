import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ItemBank } from './ItemBank';

const items = [
  { id: 1, emoji: '🍎', categoryIdx: 0 },
  { id: 2, emoji: '🐋', categoryIdx: 1 },
];

describe('ItemBank', () => {
  it('renders one chip per item and reports the pressed item', () => {
    const onSelect = jest.fn();
    const { getAllByTestId } = render(
      <ItemBank items={items} selectedId={null} onSelect={onSelect} />,
    );

    const chips = getAllByTestId('classify-item');
    expect(chips).toHaveLength(2);

    fireEvent.press(chips[1]);
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  it('renders no chips when the bank is empty', () => {
    const { queryAllByTestId } = render(
      <ItemBank items={[]} selectedId={null} onSelect={jest.fn()} />,
    );

    expect(queryAllByTestId('classify-item')).toHaveLength(0);
  });
});
