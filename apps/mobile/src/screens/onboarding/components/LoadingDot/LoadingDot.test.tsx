import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingDot } from './LoadingDot';

describe('LoadingDot', () => {
  it('renders a dot', () => {
    const { getByTestId } = render(<LoadingDot delay={0} />);

    expect(getByTestId('loading-dot')).toBeTruthy();
  });
});
