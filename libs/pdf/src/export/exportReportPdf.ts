import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface ExportReportResult {
  uri: string;
  shared: boolean;
}

/**
 * Renders the report HTML to a PDF file and shares it if the platform supports
 * it. Returns the outcome instead of showing UI feedback directly — callers
 * (screens) own how to present success/failure to the user.
 */
export async function exportReportPdf(
  html: string,
  dialogTitle: string,
): Promise<ExportReportResult> {
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle });
  }
  return { uri, shared: canShare };
}
