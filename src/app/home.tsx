'use client';

import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';
import { queueExportJob } from '@/app/api/actions/exportPDF';
import { useQuery } from '@tanstack/react-query';
import { getExportByReference } from './api/actions/getSinglePDF';
import { useRouter } from 'next/navigation';
import { ExportData } from '@/lib/validation/exportData';

/**
 * Type definition for the export data returned from the server.
 */

/**
 * ClientHome is the main UI for triggering a PDF export
 * and providing the download link once available.
 */
export default function ClientHome(): JSX.Element {
  const [reference, setReference] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [retrys, setRetrys] = useState<number>(0);
  const [showRetry, setShowRytry] = useState<boolean>(false);
  const [polling, setPolling] = useState<boolean>(true);
  const router = useRouter();
  /**
   * Fetch the latest export associated with the current reference.
   * React Query polls every 500ms until a result is available or fails after 5 retries.
   */
  const { data, isLoading, isError, error, failureCount } = useQuery<ExportData>({
    queryKey: ['pdf-export', reference],
    queryFn: () => getExportByReference(reference),
    enabled: !!reference,
    refetchInterval: polling ? 500 : false, // ✅ use state
    refetchOnWindowFocus: false,
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /**
   * Trigger a new PDF export and store the resulting reference.
   */
  const exportPdf = async (): Promise<void> => {
    setPolling(true);
    try {
      // Reset states when starting new export
      //   setSeen(false);
      setDownloadUrl(null);

      const res = await queueExportJob();
      setReference(res.reference);
    } catch (error) {
      throw new Error('Export job failed: ' + String(error));
    }
  };

  useEffect(() => {
    if (data) {
      setShowRytry(false);
      if (data.reference) {
        setDownloadUrl(data.reference);
        router.push(`/download/${data.reference}`);
        setPolling(false);
      } else {
        setRetrys((prev) => prev + 1);
        setDownloadUrl(null);
      }
    }
  }, [data]);
  useEffect(() => {
    if (retrys >= 6) {
      setRetrys(0);
      setPolling(false);
      setShowRytry(true);
    }
  }, [retrys]);

  // Check if we've exhausted all retries
  const hasExhaustedRetries = isError && failureCount >= 5;

  return (
    <div
      className='mx-auto mt-16 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl transition-all'
      aria-live='polite'
    >
      <h1 className='text-2xl font-bold text-gray-800'>📄 PDF Export Tool</h1>
      <p className='mt-2 text-sm text-gray-500'>
        Click below to generate a temporary download link.
      </p>

      <button
        onClick={exportPdf}
        disabled={isLoading}
        className='mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
        aria-busy={isLoading}
      >
        {isLoading ? 'Generating PDF...' : 'Export PDF'}
      </button>

      {/* Show loading state with retry count */}
      {retrys > 2 && retrys < 7 && (
        <p className='mt-4 text-sm text-orange-500'>🔄 Retrying... (Attempt {retrys + 1}/6)</p>
      )}

      {/* Show error after all retries are exhausted */}
      {showRetry && (
        <div className='mt-4 rounded-md border border-red-200 bg-red-50 p-4'>
          <p className='mb-2 text-sm font-medium text-red-600'>❌ Export failed after 5 attempts</p>
          <p className='text-xs text-red-500'>
            {error?.message || 'Unable to generate PDF. Please try again later.'}
          </p>
          <button
            onClick={exportPdf}
            className='mt-3 rounded bg-red-100 cursor-pointer px-3 py-1 text-xs text-red-700 transition hover:bg-red-200'
          >
            Try Again
          </button>
        </div>
      )}

      {/* Show generic error for other cases */}
      {isError && !hasExhaustedRetries && (
        <p className='mt-4 text-sm text-red-500'>⚠️ Something went wrong. Retrying...</p>
      )}

      {downloadUrl && (
        <div className='animate-fade-in mt-6 rounded-md border border-blue-100 bg-blue-50 p-4'>
          <p className='mb-2 text-sm font-medium text-blue-800'>Your download is ready:</p>
          <Link
            href={`/download/${downloadUrl}`}
            className='font-medium text-blue-600 underline hover:text-blue-800'
            aria-label='Download your generated PDF file'
          >
            Click here to download
          </Link>
        </div>
      )}
    </div>
  );
}
