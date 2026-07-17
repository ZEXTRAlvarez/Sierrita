import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FeedbackModal } from './FeedbackModal';

describe('FeedbackModal', () => {
  it('shows an error and does not call onSend when text is empty', () => {
    const onSend = jest.fn();
    const { getByText } = render(
      <FeedbackModal onSend={onSend} onCancel={jest.fn()} />,
    );

    fireEvent.press(getByText('Enviar'));

    expect(getByText('Contanos algo antes de enviar')).toBeTruthy();
    expect(onSend).not.toHaveBeenCalled();
  });

  it('calls onSend with the trimmed text when there is content', () => {
    const onSend = jest.fn();
    const { getByText, getByTestId } = render(
      <FeedbackModal onSend={onSend} onCancel={jest.fn()} />,
    );

    fireEvent.changeText(
      getByTestId('feedback-input'),
      '  Me encanta la app!  ',
    );
    fireEvent.press(getByText('Enviar'));

    expect(onSend).toHaveBeenCalledWith('Me encanta la app!');
  });

  it('calls onCancel when the cancel button is tapped', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <FeedbackModal onSend={jest.fn()} onCancel={onCancel} />,
    );

    fireEvent.press(getByText('Cancelar'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
