import React from 'react';
import { PdfState } from '@/types/pdf';

interface PdfStatusProps {
  state: PdfState;
}

const PdfStatus: React.FC<PdfStatusProps> = ({ state }) => {
  if (state.error) {
    return <span className='text-red-600'>Error: {state.error}</span>;
  }

  if (state.loading && state.token && !state.pdfReady) {
    return <span className='text-gray-600'>Processing PDF, please wait...</span>;
  }

  return null;
};

export default PdfStatus;
