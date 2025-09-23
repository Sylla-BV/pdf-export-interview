'use client';

import { useCallback, useState } from 'react';

import {
  ExportButton,
  DownloadLink,
  ExportStatus as ExportStatusComponent,
} from '@/components/PDFExport';

import { ExportStatus } from '@/types/pdf-export';
import { useExportState } from '@/hooks/use-export-state';

export default function Home() {
  const {
    hasError,
    errorMessage,
    isTriggering,
    triggerExport,
    startExportLoading,
    activeExportData,
    shouldDisableButton,
  } = useExportState();

  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const isButtonDisabled = shouldDisableButton && !countdownCompleted;

  const handleExport = useCallback(() => {
    startExportLoading();
    setCountdownCompleted(false);
    triggerExport();
  }, [triggerExport, startExportLoading]);

  const renderExportContent = () => {
    if (hasError) {
      return (
        <ExportStatusComponent
          status={ExportStatus.FAILED}
          errorMessage={errorMessage || 'An error occurred'}
        />
      );
    }

    if (!activeExportData || activeExportData.status === ExportStatus.PENDING) {
      return null;
    }

    if (
      activeExportData.status === ExportStatus.COMPLETED &&
      activeExportData.downloadUrl &&
      activeExportData.expiresAt
    ) {
      return (
        <DownloadLink
          downloadUrl={activeExportData.downloadUrl}
          expiresAt={new Date(activeExportData.expiresAt)}
          onCountdownComplete={() => setCountdownCompleted(true)}
        />
      );
    }

    return <ExportStatusComponent status={activeExportData.status} />;
  };

  return (
    <main className='animate-gradient-xy flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-blue-300 p-24'>
      <div className='w-full max-w-2xl space-y-8 text-center'>
        <h1 className='mb-2 text-4xl font-bold text-white'>PDF Export System</h1>

        <p className='mb-8 text-xl text-white/90'>
          Click the button below to export a PDF with a temporary download link
        </p>

        <div className='flex flex-col items-center space-y-6'>
          <ExportButton
            buttonText='Export PDF'
            onExport={handleExport}
            isLoading={isTriggering}
            disabled={isButtonDisabled}
          />

          <div className='flex w-full justify-center'>{renderExportContent()}</div>
        </div>
      </div>
    </main>
  );
}
