import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ParentsHeader } from './ParentsHeader';

describe('ParentsHeader', () => {
  it('renders the profile name and age', () => {
    const { getByText } = render(
      <ParentsHeader profileName="Sofía" profileAge={5} onClose={jest.fn()} onLock={jest.fn()} />,
    );

    expect(getByText('Sofía')).toBeTruthy();
    expect(getByText('5 años')).toBeTruthy();
  });

  it('calls onClose when the close button is tapped', () => {
    const onClose = jest.fn();
    const { getByText } = render(<ParentsHeader onClose={onClose} onLock={jest.fn()} />);

    fireEvent.press(getByText('✕'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onLock when the lock button is tapped', () => {
    const onLock = jest.fn();
    const { getByText } = render(<ParentsHeader onClose={jest.fn()} onLock={onLock} />);

    fireEvent.press(getByText('🔒'));

    expect(onLock).toHaveBeenCalledTimes(1);
  });
});
