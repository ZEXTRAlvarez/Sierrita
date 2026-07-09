import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SectionCard } from './SectionCard';

describe('SectionCard', () => {
  it('renders the title and children', () => {
    const { getByText } = render(
      <SectionCard title="Outfits">
        <Text>contenido</Text>
      </SectionCard>,
    );

    expect(getByText('Outfits')).toBeTruthy();
    expect(getByText('contenido')).toBeTruthy();
  });

  it('omits the subtitle when none is given', () => {
    const { queryByText } = render(
      <SectionCard title="Outfits">
        <Text>contenido</Text>
      </SectionCard>,
    );

    expect(queryByText('Ganás outfits acumulando XP')).toBeNull();
  });

  it('renders the subtitle when given', () => {
    const { getByText } = render(
      <SectionCard title="Outfits" subtitle="Ganás outfits acumulando XP">
        <Text>contenido</Text>
      </SectionCard>,
    );

    expect(getByText('Ganás outfits acumulando XP')).toBeTruthy();
  });
});
