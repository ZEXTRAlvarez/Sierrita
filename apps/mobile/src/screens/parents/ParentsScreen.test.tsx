import React from 'react';
import { fireEvent } from '@testing-library/react-native';
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
  loading: true,
  exporting: false,
  unlock: jest.fn(),
  updateConfig: jest.fn(),
  changePin: jest.fn(),
  exportPdf: jest.fn(async () => ({ ok: true, shared: true, uri: '' })),
};
jest.mock('./hooks/useParentDashboard', () => ({ useParentDashboard: () => mockDashboard }));

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

    expect(getByText('No se encontró configuración. Seleccioná un perfil.')).toBeTruthy();

    fireEvent.press(getByText('← Volver'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows the PIN gate when a config exists but the dashboard is locked', () => {
    mockDashboard.loading = false;
    mockDashboard.parentConfig = { profileId: 'p1', pinHash: '', maxSessionMinutes: 30, worldsEnabled: ['jungle'], updatedAt: 0 };
    const { getByText } = renderWithProviders(<ParentsScreen />);

    expect(getByText('Creá tu PIN de padre/madre')).toBeTruthy();
  });
});
