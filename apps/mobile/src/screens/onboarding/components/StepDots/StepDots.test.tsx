import React from 'react';
import { render } from '@testing-library/react-native';
import { StepDots } from './StepDots';

describe('StepDots', () => {
  it('marks the current step dot as active', () => {
    const { getByTestId } = render(<StepDots step="age" />);

    expect(getByTestId('step-dot-age').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#4CAF50' })]),
    );
  });
});
