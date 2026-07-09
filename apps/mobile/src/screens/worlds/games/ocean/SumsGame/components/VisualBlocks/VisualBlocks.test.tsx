import React from 'react';
import { render } from '@testing-library/react-native';
import { VisualBlocks } from './VisualBlocks';

describe('VisualBlocks', () => {
  it('renders one block per unit for both operands when both are 10 or below', () => {
    const { getAllByTestId } = render(<VisualBlocks a={3} b={5} op="add" />);

    expect(getAllByTestId('block-a')).toHaveLength(3);
    expect(getAllByTestId('block-b')).toHaveLength(5);
  });

  it('renders nothing when either operand exceeds 10', () => {
    const { toJSON } = render(<VisualBlocks a={12} b={4} op="sub" />);

    expect(toJSON()).toBeNull();
  });
});
