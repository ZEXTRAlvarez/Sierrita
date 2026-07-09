import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { SettingsSection } from './SettingsSection';
import type { ParentConfig } from '@sierrita/parents';

const baseConfig: ParentConfig = {
  profileId: 'p1',
  pinHash: '',
  maxSessionMinutes: 30,
  worldsEnabled: ['jungle', 'ocean', 'space'],
  updatedAt: 0,
};

describe('SettingsSection', () => {
  it('renders a chip per session-time option and marks the current one selected', () => {
    const { getByText, getByRole } = renderWithProviders(<SettingsSection config={baseConfig} onChange={jest.fn()} />);

    expect(getByText('30min')).toBeTruthy();
    const chips = getByRole('button', { name: '30min' });
    expect(chips.props.accessibilityState).toMatchObject({ selected: true });
  });

  it('calls onChange with the new session time when a chip is tapped', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithProviders(<SettingsSection config={baseConfig} onChange={onChange} />);

    fireEvent.press(getByText('45min'));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ maxSessionMinutes: 45 }));
  });

  it('toggles a world on when its switch is turned on', () => {
    const onChange = jest.fn();
    const config = { ...baseConfig, worldsEnabled: ['ocean', 'space'] as ParentConfig['worldsEnabled'] };
    const { getAllByRole } = renderWithProviders(<SettingsSection config={config} onChange={onChange} />);

    fireEvent(getAllByRole('switch')[0], 'valueChange', true);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ worldsEnabled: expect.arrayContaining(['jungle', 'ocean', 'space']) }),
    );
  });

  it('refuses to disable the last remaining world', () => {
    const onChange = jest.fn();
    const config = { ...baseConfig, worldsEnabled: ['jungle'] as ParentConfig['worldsEnabled'] };
    const { getAllByRole } = renderWithProviders(<SettingsSection config={config} onChange={onChange} />);

    fireEvent(getAllByRole('switch')[0], 'valueChange', false);

    expect(onChange).not.toHaveBeenCalled();
  });
});
