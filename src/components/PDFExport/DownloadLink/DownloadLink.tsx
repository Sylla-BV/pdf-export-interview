'use client';

import React, { useState } from 'react';
import Countdown from 'react-countdown';
import { Download, Copy, Check } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { CountdownDisplay } from './CountdownDisplay';
import type { DownloadLinkProps } from './DownloadLink.types';

export function DownloadLink({ downloadUrl, expiresAt, onCountdownComplete }: DownloadLinkProps) {
  const [copied, setCopied] = useState(false);
  const [countdownCompleted, setCountdownCompleted] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <Card
      className={`mx-auto w-full max-w-md rounded-lg border bg-white shadow-lg ${countdownCompleted ? 'border-red-200' : 'border-gray-200'}`}
    >
      <CardContent className='p-6'>
        <div className='space-y-4 text-center'>
          <Countdown
            date={expiresAt}
            renderer={CountdownDisplay}
            onComplete={() => {
              setCountdownCompleted(true);
              onCountdownComplete?.();
            }}
          />

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Download Link:</label>
            <div className='flex items-center space-x-2'>
              <Input
                value={downloadUrl}
                readOnly
                className={`flex-1 font-mono text-xs ${countdownCompleted ? 'border-red-200 bg-red-50' : 'bg-gray-50'}`}
              />
              <Button onClick={handleCopyLink} size='sm' variant='outline' className='px-3'>
                {copied ? (
                  <Check className='h-4 w-4 text-green-600' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            </div>
            {copied && <p className='text-xs text-green-600'>Link copied to clipboard!</p>}
          </div>

          <Button
            onClick={() => window.open(downloadUrl, '_blank')}
            size='lg'
            disabled={countdownCompleted}
            className={`w-full rounded-lg px-6 py-3 font-semibold shadow-md transition-all duration-200 ${
              countdownCompleted
                ? 'cursor-not-allowed bg-gray-400 text-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Download className='mr-2 h-5 w-5' />
            {countdownCompleted ? 'Download Expired' : 'Download PDF'}
          </Button>

          {countdownCompleted && (
            <p className='text-sm text-red-600'>
              This link has expired. Please create a new export.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
