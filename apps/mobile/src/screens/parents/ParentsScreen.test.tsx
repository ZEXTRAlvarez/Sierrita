import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import ParentsScreen from './ParentsScreen';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
}));

const mockDashboard: Record<string, unknown> = {
  profile: { name: 'Sofía', age: 5 },
  parentConfig: null,
  globalStats: null,
  gameStats: [],
  learningGoal: null,
  weeklyProgress: null,
  loading: true,
  exporting: false,
  unlock: jest.fn(),
  updateConfig: jest.fn(),
  updateGoal: jest.fn(),
  changePin: jest.fn(),
  exportPdf: jest.fn(async () => ({ ok: true, shared: true, uri: '' })),
};
jest.mock('./hooks/useParentDashboard', () => ({
  useParentDashboard: () => mockDashboard,
}));

jest.mock('@sierrita/parents', () => ({
  verifyPin: jest.fn(
    async (pin: string, storedHash: string) => pin === storedHash,
  ),
}));

describe('ParentsScreen', () => {
  beforeEach(() => {
    mockDashboard.loading = true;
    mockDashboard.parentConfig = null;
  });

  it('shows a loading indicator while the dashboard data loads', () => {
    const { getByTestId } = renderWithProviders(<ParentsScreen />);

    expect(getByTestId('parents-screen-loading')).toBeTruthy();
  });

  it('shows an error state and a way back when no config exists for the profile', () => {
    mockDashboard.loading = false;
    mockDashboard.parentConfig = null;
    const { getByText } = renderWithProviders(<ParentsScreen />);

    expect(
      getByText('No se encontró configuración. Seleccioná un perfil.'),
    ).toBeTruthy();

    fireEvent.press(getByText('← Volver'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows the PIN gate when a config exists but the dashboard is locked', () => {
    mockDashboard.loading = false;
    mockDashboard.parentConfig = {
      profileId: 'p1',
      pinHash: '',
      maxSessionMinutes: 30,
      worldsEnabled: ['jungle'],
      updatedAt: 0,
    };
    const { getByText } = renderWithProviders(<ParentsScreen />);

    expect(getByText('Creá tu PIN de padre/madre')).toBeTruthy();
  });

  it('opens the Play Store link when "Valorar la app" is tapped', async () => {
    mockDashboard.loading = false;
    mockDashboard.parentConfig = {
      profileId: 'p1',
      pinHash: 'hash',
      maxSessionMinutes: 30,
      worldsEnabled: ['jungle'],
      updatedAt: 0,
    };
    mockDashboard.globalStats = { totalSessions: 0, totalScore: 0 };
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

    const { getByText, getByPlaceholderText } = renderWithProviders(
      <ParentsScreen />,
    );
    fireEvent.changeText(getByPlaceholderText('• • • •'), 'hash');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() => expect(getByText('⭐ Valorar la app')).toBeTruthy());
    fireEvent.press(getByText('⭐ Valorar la app'));

    await waitFor(() =>
      expect(openURL).toHaveBeenCalledWith(
        'https://play.google.com/store/apps/details?id=com.rodaalvarez.sierrita',
      ),
    );
  });

  it('opens a mailto link with the feedback text when the feedback modal is sent', async () => {
    mockDashboard.loading = false;
    mockDashboard.parentConfig = {
      profileId: 'p1',
      pinHash: 'hash',
      maxSessionMinutes: 30,
      worldsEnabled: ['jungle'],
      updatedAt: 0,
    };
    mockDashboard.globalStats = { totalSessions: 0, totalScore: 0 };
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

    const { getByText, getByTestId, getByPlaceholderText } =
      renderWithProviders(<ParentsScreen />);
    fireEvent.changeText(getByPlaceholderText('• • • •'), 'hash');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() =>
      expect(getByText('✉️ Enviar comentarios')).toBeTruthy(),
    );
    fireEvent.press(getByText('✉️ Enviar comentarios'));
    fireEvent.changeText(getByTestId('feedback-input'), 'Muy buena app');
    fireEvent.press(getByText('Enviar'));

    await waitFor(() =>
      expect(openURL).toHaveBeenCalledWith(
        expect.stringContaining('mailto:rodaaa18@gmail.com'),
      ),
    );
    expect(openURL).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('Muy buena app')),
    );
  });

  it('shows a fallback alert when no mail app can handle the feedback link', async () => {
    mockDashboard.loading = false;
    mockDashboard.parentConfig = {
      profileId: 'p1',
      pinHash: 'hash',
      maxSessionMinutes: 30,
      worldsEnabled: ['jungle'],
      updatedAt: 0,
    };
    mockDashboard.globalStats = { totalSessions: 0, totalScore: 0 };
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const openURL = jest.spyOn(Linking, 'openURL');
    openURL.mockClear();
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation(() => undefined);

    const { getByText, getByTestId, getByPlaceholderText } =
      renderWithProviders(<ParentsScreen />);
    fireEvent.changeText(getByPlaceholderText('• • • •'), 'hash');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() =>
      expect(getByText('✉️ Enviar comentarios')).toBeTruthy(),
    );
    fireEvent.press(getByText('✉️ Enviar comentarios'));
    fireEvent.changeText(getByTestId('feedback-input'), 'Muy buena app');
    fireEvent.press(getByText('Enviar'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        'No se encontró una app de correo',
        expect.stringContaining('rodaaa18@gmail.com'),
      ),
    );
    expect(openURL).not.toHaveBeenCalled();
  });
});
