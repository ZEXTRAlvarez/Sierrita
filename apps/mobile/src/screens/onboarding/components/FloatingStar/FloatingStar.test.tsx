import React from 'react';
import { render } from '@testing-library/react-native';
import { FloatingStar } from './FloatingStar';

describe('FloatingStar', () => {
  it('renders the given emoji', () => {
    const { getByText } = render(
      <FloatingStar emoji="🌟" x={0.5} y={0.5} size={30} delay={0} />,
    );

    expect(getByText('🌟')).toBeTruthy();
  });
});
