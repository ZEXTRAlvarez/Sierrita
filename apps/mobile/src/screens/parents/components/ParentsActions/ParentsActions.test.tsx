import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { ParentsActions } from './ParentsActions';

describe('ParentsActions', () => {
  it('shows a busy label and marks the export button disabled while exporting', () => {
    // fireEvent.press() dispatches straight to the onPress prop rather than
    // performing real hit-testing, so it can't observe the pointerEvents:
    // 'none' a real touch would hit — assert on the props PrimaryButton
    // actually sets when disabled instead (see libs/ui's PrimaryButton spec).
    const onExportPdf = jest.fn();
    const { getByText, queryByText, getAllByRole } = renderWithProviders(
      <ParentsActions
        exporting
        onExportPdf={onExportPdf}
        onChangePin={jest.fn()}
        onSwitchProfile={jest.fn()}
        onRateApp={jest.fn()}
        onSendFeedback={jest.fn()}
      />,
    );

    expect(getByText('Generando…')).toBeTruthy();
    expect(queryByText('📄 Descargar informe PDF')).toBeNull();

    const exportButton = getAllByRole('button')[0];
    expect(exportButton.props.accessibilityState).toMatchObject({
      disabled: true,
    });
    expect(exportButton.props.onPress).toBeUndefined();
  });

  it('calls each handler when its button is tapped', () => {
    const onExportPdf = jest.fn();
    const onChangePin = jest.fn();
    const onSwitchProfile = jest.fn();
    const onRateApp = jest.fn();
    const onSendFeedback = jest.fn();
    const { getByText } = renderWithProviders(
      <ParentsActions
        exporting={false}
        onExportPdf={onExportPdf}
        onChangePin={onChangePin}
        onSwitchProfile={onSwitchProfile}
        onRateApp={onRateApp}
        onSendFeedback={onSendFeedback}
      />,
    );

    fireEvent.press(getByText('📄 Descargar informe PDF'));
    fireEvent.press(getByText('🔐 Cambiar PIN'));
    fireEvent.press(getByText('🔄 Cambiar de perfil'));
    fireEvent.press(getByText('⭐ Valorar la app'));
    fireEvent.press(getByText('✉️ Enviar comentarios'));

    expect(onExportPdf).toHaveBeenCalledTimes(1);
    expect(onChangePin).toHaveBeenCalledTimes(1);
    expect(onSwitchProfile).toHaveBeenCalledTimes(1);
    expect(onRateApp).toHaveBeenCalledTimes(1);
    expect(onSendFeedback).toHaveBeenCalledTimes(1);
  });
});
