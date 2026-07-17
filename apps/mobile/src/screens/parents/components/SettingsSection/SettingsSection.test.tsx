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
  hasSeenWalkthrough: true,
  fontScale: 'normal',
  highContrast: false,
};

describe('SettingsSection', () => {
  it('renders a chip per session-time option and marks the current one selected', () => {
    const { getByText, getByRole } = renderWithProviders(
      <SettingsSection
        config={baseConfig}
        onChange={jest.fn()}
        goalTarget={null}
        onChangeGoal={jest.fn()}
      />,
    );

    expect(getByText('30min')).toBeTruthy();
    const chips = getByRole('button', { name: '30min' });
    expect(chips.props.accessibilityState).toMatchObject({ selected: true });
  });

  it('calls onChange with the new session time when a chip is tapped', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithProviders(
      <SettingsSection
        config={baseConfig}
        onChange={onChange}
        goalTarget={null}
        onChangeGoal={jest.fn()}
      />,
    );

    fireEvent.press(getByText('45min'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ maxSessionMinutes: 45 }),
    );
  });

  it('toggles a world on when its switch is turned on', () => {
    const onChange = jest.fn();
    const config = {
      ...baseConfig,
      worldsEnabled: ['ocean', 'space'] as ParentConfig['worldsEnabled'],
    };
    const { getAllByRole } = renderWithProviders(
      <SettingsSection
        config={config}
        onChange={onChange}
        goalTarget={null}
        onChangeGoal={jest.fn()}
      />,
    );

    fireEvent(getAllByRole('switch')[0], 'valueChange', true);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        worldsEnabled: expect.arrayContaining(['jungle', 'ocean', 'space']),
      }),
    );
  });

  it('refuses to disable the last remaining world', () => {
    const onChange = jest.fn();
    const config = {
      ...baseConfig,
      worldsEnabled: ['jungle'] as ParentConfig['worldsEnabled'],
    };
    const { getAllByRole } = renderWithProviders(
      <SettingsSection
        config={config}
        onChange={onChange}
        goalTarget={null}
        onChangeGoal={jest.fn()}
      />,
    );

    fireEvent(getAllByRole('switch')[0], 'valueChange', false);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChangeGoal with the tapped weekly-goal chip value', () => {
    const onChangeGoal = jest.fn();
    const { getByText } = renderWithProviders(
      <SettingsSection
        config={baseConfig}
        onChange={jest.fn()}
        goalTarget={3}
        onChangeGoal={onChangeGoal}
      />,
    );

    fireEvent.press(getByText('7'));

    expect(onChangeGoal).toHaveBeenCalledWith(7);
  });

  it('calls onChange with the new font scale when a chip is tapped', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithProviders(
      <SettingsSection
        config={baseConfig}
        onChange={onChange}
        goalTarget={null}
        onChangeGoal={jest.fn()}
      />,
    );

    fireEvent.press(getByText('Grande'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ fontScale: 'large' }),
    );
  });

  it('calls onChange with the toggled highContrast value', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithProviders(
      <SettingsSection
        config={baseConfig}
        onChange={onChange}
        goalTarget={null}
        onChangeGoal={jest.fn()}
      />,
    );

    const switches = getAllByRole('switch');
    fireEvent(switches[switches.length - 1], 'valueChange', true);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ highContrast: true }),
    );
  });
});
