import React from 'react';
import { render } from '@testing-library/react-native';
import { PetNeedBar } from './PetNeedBar';

describe('PetNeedBar', () => {
  it('renders the label and rounded percentage', () => {
    const { getByText } = render(
      <PetNeedBar label="Hambre" value={72.6} color="#FF7043" />,
    );

    expect(getByText('Hambre')).toBeTruthy();
    expect(getByText('73')).toBeTruthy();
  });
});
