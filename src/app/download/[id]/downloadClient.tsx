'use client';

import { useEffect, useState } from 'react';
import { getExportByReference } from '@/app/api/actions/getSinglePDF';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Link from 'next/link';

export default function DownloadClient({ id }: { id: string }) {
  const [expired, setExpired] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pdf-export', id],
    queryFn: () => getExportByReference(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const isExpired = data?.createdAt && dayjs().diff(dayjs(data.createdAt), 'seconds') > 120;

  useEffect(() => {
    setInterval(() => {
      setExpired(!!data?.createdAt && dayjs().diff(dayjs(data.createdAt), 'seconds') > 120);
    }, 1001);
  }, [data]);

  useEffect(() => {
    if (data?.url && !isExpired && !pdfBlob) {
      // Only fetch if we don't already have a blob
      fetch(data.url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          setPdfBlob(blobUrl);
        })
        .catch((error) => {
          console.error('Error fetching PDF:', error);
        });
    } else if (isExpired) {
      setExpired(true);
      // Clean up blob URL when expired
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
        setPdfBlob(null);
      }
    }

    // Cleanup blob URL when component unmounts
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [data, isExpired]); // Removed pdfBlob from dependencies

  if (expired) {
    return (
      <div className='animate-fade-in mx-auto mt-20 w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-md'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600'>
            ⌛
          </div>
        </div>

        <h2 className='text-xl font-semibold text-red-700'>Link Expired</h2>
        <p className='mt-2 text-sm text-gray-600'>
          This download link has expired. PDF links are valid for 2 minutes after creation to ensure
          security.
        </p>

        <Link
          href='/'
          className='mt-6 inline-block rounded bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700'
        >
          Generate a New PDF
        </Link>
      </div>
    );
  }

  // Show PDF viewer when blob is ready
  if (!expired && pdfBlob) {
    return (
      <div className='mx-auto mt-8 w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-lg'>
        <div className='flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4'>
          <h2 className='text-lg font-semibold text-gray-800'>📄 PDF Document</h2>
          <div className='flex gap-3'>
            <a
              href={pdfBlob}
              download='document.pdf'
              className='rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-blue-700'
              aria-label='Download PDF'
            >
              Download
            </a>
            <Link
              href='/'
              className='rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-gray-700'
            >
              Generate New
            </Link>
          </div>
        </div>

        <div className='relative w-full' style={{ height: '80vh' }}>
          <iframe
            src={pdfBlob}
            className='h-full w-full border-0'
            title='PDF Document'
            style={{ minHeight: '600px' }}
          />
        </div>

        <div className='border-t border-gray-200 bg-gray-50 px-6 py-3 text-center'>
          <p className='text-xs text-gray-500'>
            This document will expire in 2 minutes from generation time for security.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto mt-16 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg'>
      <h2 className='mb-1 text-2xl font-bold text-gray-800'>📥 Loading PDF</h2>
      <p className='mb-4 text-sm text-gray-500'>
        This link expires after 2 minutes. Please wait while we load your document.
      </p>

      {!id && (
        <p className='text-sm text-red-500'>
          ❌ Missing export reference. Please retry from the homepage.
        </p>
      )}

      {isLoading && (
        <div className='animate-pulse text-sm text-blue-600'>⏳ Generating your file...</div>
      )}

      {isError && (
        <div className='mt-2 text-sm text-red-500'>
          ⚠️ Unable to retrieve export. Please try again.
        </div>
      )}

      {isExpired && (
        <div className='mt-4 text-sm text-red-600'>
          ⚠️ This link has expired. Please generate a new export.
        </div>
      )}

      {data?.url && !pdfBlob && !isExpired && (
        <div className='animate-fade-in mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 shadow-inner'>
          <p className='mb-2 text-sm font-medium text-blue-800'>⏳ Loading PDF viewer...</p>
          <div className='mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent'></div>
        </div>
      )}

      {!data?.url && !isLoading && !isError && (
        <p className='mt-2 text-sm text-gray-400'>⌛ Waiting for export to complete...</p>
      )}
    </div>
  );
}
