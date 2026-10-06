import React from 'react';
import { render } from '@testing-library/react-native';
import { GroupsVisual } from './GroupsVisual';

describe('GroupsVisual', () => {
  it('renders `a` groups of `b` dots for multiplication', () => {
    const { getAllByTestId } = render(
      <GroupsVisual op="multiply" a={3} b={4} />,
    );

    expect(getAllByTestId('visual-group')).toHaveLength(3);
    expect(getAllByTestId('visual-dot')).toHaveLength(12);
  });

  it('splits the dividend into `b` equal groups for division', () => {
    const { getAllByTestId } = render(
      <GroupsVisual op="divide" a={12} b={3} />,
    );

    expect(getAllByTestId('visual-group')).toHaveLength(3);
    expect(getAllByTestId('visual-dot')).toHaveLength(12);
  });

  it('renders nothing when a group would have more than 10 dots', () => {
    const { toJSON } = render(<GroupsVisual op="multiply" a={1} b={11} />);

    expect(toJSON()).toBeNull();
  });
});
