import React from 'react';
import { render } from '@testing-library/react-native';
import { ObjectGrid } from './ObjectGrid';

describe('ObjectGrid', () => {
  it('renders one emoji per item when count is 20 or below', () => {
    const { getAllByText } = render(<ObjectGrid count={5} emoji="🐟" />);

    expect(getAllByText('🐟')).toHaveLength(5);
  });

  it('groups counts above 20 into tens plus loose units', () => {
    const { getAllByText } = render(<ObjectGrid count={23} emoji="🐟" />);

    // 2 groups of ten (each with one emoji) + 3 loose units = 5 emoji total
    expect(getAllByText('🐟')).toHaveLength(5);
    expect(getAllByText('10')).toHaveLength(2);
  });
});
