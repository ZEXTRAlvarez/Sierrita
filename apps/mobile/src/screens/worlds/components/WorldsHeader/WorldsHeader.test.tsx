import React from 'react';
import { render } from '@testing-library/react-native';
import { WorldsHeader } from './WorldsHeader';

describe('WorldsHeader', () => {
  it('shows the profile name and age when a profile is given', () => {
    const { getByText } = render(<WorldsHeader profileName="Sofía" profileAge={5} />);

    expect(getByText('¡Elegí tu mundo!')).toBeTruthy();
    expect(getByText('Sofía · 5 años')).toBeTruthy();
  });

  it('omits the age badge when there is no profile name', () => {
    const { queryByText } = render(<WorldsHeader />);

    expect(queryByText(/años/)).toBeNull();
  });
});
