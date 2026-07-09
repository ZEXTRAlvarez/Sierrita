import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { exportReportPdf } from './exportReportPdf';

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(),
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

describe('exportReportPdf', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shares the generated PDF when sharing is available', async () => {
    (Print.printToFileAsync as jest.Mock).mockResolvedValue({
      uri: 'file://report.pdf',
    });
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

    const result = await exportReportPdf('<html></html>', 'Reporte de Sofía');

    expect(Print.printToFileAsync).toHaveBeenCalledWith({
      html: '<html></html>',
      base64: false,
    });
    expect(Sharing.shareAsync).toHaveBeenCalledWith('file://report.pdf', {
      mimeType: 'application/pdf',
      dialogTitle: 'Reporte de Sofía',
    });
    expect(result).toEqual({ uri: 'file://report.pdf', shared: true });
  });

  it('skips sharing and reports shared:false when sharing is unavailable', async () => {
    (Print.printToFileAsync as jest.Mock).mockResolvedValue({
      uri: 'file://report.pdf',
    });
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

    const result = await exportReportPdf('<html></html>', 'Reporte');

    expect(Sharing.shareAsync).not.toHaveBeenCalled();
    expect(result).toEqual({ uri: 'file://report.pdf', shared: false });
  });

  it('propagates a failure to generate the PDF instead of swallowing it', async () => {
    (Print.printToFileAsync as jest.Mock).mockRejectedValue(
      new Error('disk full'),
    );

    await expect(exportReportPdf('<html></html>', 'Reporte')).rejects.toThrow(
      'disk full',
    );
  });
});
