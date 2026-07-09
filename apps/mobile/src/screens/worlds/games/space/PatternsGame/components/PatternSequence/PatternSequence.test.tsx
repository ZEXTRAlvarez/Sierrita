import React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';
import { PatternSequence } from './PatternSequence';

describe('PatternSequence', () => {
  it('renders every non-blank item and a "?" at the missing index', () => {
    const { getByText, queryByText } = render(
      <PatternSequence
        sequence={['🔴', '🔵', '🔴']}
        missingIdx={2}
        bounceAnim={new Animated.Value(1)}
      />,
    );

    expect(getByText('🔴')).toBeTruthy();
    expect(getByText('🔵')).toBeTruthy();
    expect(getByText('?')).toBeTruthy();
    expect(queryByText('🔴')).toBeTruthy();
  });

  it('does not render a "?" when there is no missing index in range', () => {
    const { queryByText, getAllByText } = render(
      <PatternSequence
        sequence={['🌟', '🌙']}
        missingIdx={-1}
        bounceAnim={new Animated.Value(1)}
      />,
    );

    expect(queryByText('?')).toBeNull();
    expect(getAllByText(/🌟|🌙/)).toHaveLength(2);
  });
});
