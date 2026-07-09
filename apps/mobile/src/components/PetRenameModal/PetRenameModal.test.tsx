import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PetRenameModal } from './PetRenameModal';

describe('PetRenameModal', () => {
  it('starts pre-filled with the initial name', () => {
    const { getByDisplayValue } = render(
      <PetRenameModal initialName="Chispita" onSave={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(getByDisplayValue('Chispita')).toBeTruthy();
  });

  it('saves the edited name', () => {
    const onSave = jest.fn();
    const { getByDisplayValue, getByText } = render(
      <PetRenameModal initialName="Chispita" onSave={onSave} onCancel={jest.fn()} />,
    );

    fireEvent.changeText(getByDisplayValue('Chispita'), 'Rayo');
    fireEvent.press(getByText('Guardar'));

    expect(onSave).toHaveBeenCalledWith('Rayo');
  });

  it('calls onCancel when Cancelar is tapped', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <PetRenameModal initialName="Chispita" onSave={jest.fn()} onCancel={onCancel} />,
    );

    fireEvent.press(getByText('Cancelar'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
