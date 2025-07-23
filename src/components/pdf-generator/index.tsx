'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import PdfDownloadLink from '@/components/pdf-generator/pdf-download-link';
import PdfStatus from '@/components/pdf-generator/pdf-status';
import PdfCountdown from '@/components/pdf-generator/pdf-countdown';

const PdfGenerator: React.FC = () => {
  const { state, generatePdf, resetPdf } = usePdfGenerator();

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='flex gap-2'>
        <Button onClick={generatePdf} disabled={state.loading || state.pdfReady}>
          {state.loading ? 'Generating...' : 'Generate PDF'}
        </Button>
      </div>

      {state.pdfReady && state.token && <PdfDownloadLink token={state.token} />}

      {state.pdfReady && state.expiresAt && (
        <PdfCountdown expiresAt={state.expiresAt} onExpire={resetPdf} />
      )}

      <PdfStatus state={state} />
    </div>
  );
};

export default PdfGenerator;
