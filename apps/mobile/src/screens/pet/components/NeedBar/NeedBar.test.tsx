import React from 'react';
import { render } from '@testing-library/react-native';
import { NeedBar } from './NeedBar';

describe('NeedBar', () => {
  it('renders the label and rounded percentage', () => {
    const { getByText } = render(
      <NeedBar label="Hambre" value={72.6} color="#FF7043" />,
    );

    expect(getByText('Hambre')).toBeTruthy();
    expect(getByText('73')).toBeTruthy();
  });

  it('renders an optional leading icon', () => {
    const { getByText } = render(
      <NeedBar icon={<></>} label="Sed" value={50} color="#2196F3" />,
    );

    expect(getByText('Sed')).toBeTruthy();
  });
});
