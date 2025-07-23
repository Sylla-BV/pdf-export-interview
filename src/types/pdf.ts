export type PdfState = {
  loading: boolean;
  token: string | null;
  pdfReady: boolean;
  error?: string;
  expiresAt?: Date;
};

export type PdfAction =
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_TOKEN'; token: string }
  | { type: 'READY'; expiresAt?: Date }
  | { type: 'FAIL'; error?: string }
  | { type: 'RESET' };

