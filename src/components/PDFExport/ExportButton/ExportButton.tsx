'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import type { ExportButtonProps } from './ExportButton.types';

export function ExportButton({ onExport, isLoading, disabled = false, buttonText = "Export PDF" }: ExportButtonProps) {
  return (
    <Button
      onClick={onExport}
      disabled={isLoading || disabled}
      size="lg"
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-5 w-5" />
          {buttonText}
        </>
      )}
    </Button>
  );
}
