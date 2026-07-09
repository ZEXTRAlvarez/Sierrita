import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ParentsTabBar } from './ParentsTabBar';

describe('ParentsTabBar', () => {
  it('renders both tabs', () => {
    const { getByText } = render(<ParentsTabBar active="stats" onChange={jest.fn()} />);

    expect(getByText('📊 Estadísticas')).toBeTruthy();
    expect(getByText('⚙️ Configuración')).toBeTruthy();
  });

  it('calls onChange with the tapped tab id', () => {
    const onChange = jest.fn();
    const { getByText } = render(<ParentsTabBar active="stats" onChange={onChange} />);

    fireEvent.press(getByText('⚙️ Configuración'));

    expect(onChange).toHaveBeenCalledWith('settings');
  });
});
