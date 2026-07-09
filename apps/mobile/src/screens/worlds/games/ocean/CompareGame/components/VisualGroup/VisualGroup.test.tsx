import React from 'react';
import { render } from '@testing-library/react-native';
import { VisualGroup } from './VisualGroup';

describe('VisualGroup', () => {
  it('renders one emoji per count', () => {
    const { getAllByText } = render(<VisualGroup count={4} emoji="⭐" />);

    expect(getAllByText('⭐')).toHaveLength(4);
  });

  it('renders nothing when count is 0', () => {
    const { queryAllByText } = render(<VisualGroup count={0} emoji="⭐" />);

    expect(queryAllByText('⭐')).toHaveLength(0);
  });
});
