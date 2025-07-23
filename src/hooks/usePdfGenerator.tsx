import { useReducer, useRef, useEffect, useCallback } from 'react';

import { requestPdfAction } from '@/app/actions/pdf';
import { PdfState, PdfAction } from '@/types/pdf';

const PDF_CONFIG = {
  CHECK_INTERVAL: 5000,
  MAX_CHECK_ATTEMPTS: 30,
} as const;

const PDF_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TOKEN: 'SET_TOKEN',
  READY: 'READY',
  FAIL: 'FAIL',
  RESET: 'RESET',
} as const;

const INITIAL_STATE: PdfState = {
  loading: false,
  token: null,
  pdfReady: false,
  error: undefined,
  expiresAt: undefined,
};

const pdfReducer = (state: PdfState, action: PdfAction): PdfState => {
  switch (action.type) {
    case PDF_ACTIONS.SET_LOADING:
      return { ...state, loading: action.loading };
    case PDF_ACTIONS.SET_TOKEN:
      return { ...state, token: action.token };
    case PDF_ACTIONS.READY:
      return { ...state, loading: false, pdfReady: true, expiresAt: action.expiresAt };
    case PDF_ACTIONS.FAIL:
      return { ...state, loading: false, error: action.error || 'PDF generation failed' };
    case PDF_ACTIONS.RESET:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

export const usePdfGenerator = () => {
  const [state, dispatch] = useReducer(pdfReducer, INITIAL_STATE);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);

  const pollForPdf = useCallback(async (token: string) => {
    attemptsRef.current = 0;

    const check = async () => {
      attemptsRef.current++;

      try {
        const response = await fetch(`/api/pdf/${token}`);
        if (response.ok) {
          const expiresAtHeader = response.headers.get('x-expires-at');
          const expiresAt = expiresAtHeader ? new Date(expiresAtHeader) : undefined;
          dispatch({ type: PDF_ACTIONS.READY, expiresAt });

          return;
        }

        if (attemptsRef.current >= PDF_CONFIG.MAX_CHECK_ATTEMPTS) {
          dispatch({ type: PDF_ACTIONS.FAIL, error: 'PDF generation timeout' });

          return;
        }

        timeoutRef.current = setTimeout(check, PDF_CONFIG.CHECK_INTERVAL);
      } catch {
        dispatch({ type: PDF_ACTIONS.FAIL, error: 'Failed to check PDF status' });
      }
    };

    check();
  }, []);

  const generatePdf = useCallback(async () => {
    dispatch({ type: PDF_ACTIONS.SET_LOADING, loading: true });

    try {
      const data = await requestPdfAction();
      dispatch({ type: PDF_ACTIONS.SET_TOKEN, token: data.token });
      pollForPdf(data.token);
    } catch (error) {
      dispatch({
        type: PDF_ACTIONS.FAIL,
        error: error instanceof Error ? error.message : 'Failed to start PDF generation',
      });
    }
  }, [pollForPdf]);

  const resetPdf = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    dispatch({ type: PDF_ACTIONS.RESET });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { state, generatePdf, resetPdf };
};
