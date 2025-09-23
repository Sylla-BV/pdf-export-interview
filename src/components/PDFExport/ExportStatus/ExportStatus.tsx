'use client';

import { XCircle, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { cardStyles } from '@/lib/styles';
import type { ExportStatusProps, StatusConfig } from './ExportStatus.types';
import { ExportStatus as ExportStatusEnum } from '@/types/pdf-export';

export function ExportStatus({ status, errorMessage }: ExportStatusProps) {
  const getStatusConfig = (status: ExportStatusEnum): StatusConfig => {
    switch (status) {
      case ExportStatusEnum.PROCESSING:
        return {
          icon: <Loader2 className='h-4 w-4 animate-spin' />,
          label: 'Processing',
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case ExportStatusEnum.FAILED:
        return {
          icon: <XCircle className='h-4 w-4' />,
          label: 'Failed',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        throw new Error(`Unhandled status: ${status}`);
    }
  };

  const config = getStatusConfig(status);

  return (
    <Card className={cardStyles.default}>
      <CardContent className={cardStyles.content}>
        <div className='flex items-center justify-center space-x-2'>
          {config.icon}
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        </div>
        {errorMessage && <p className='mt-3 text-center text-sm text-red-600'>{errorMessage}</p>}
      </CardContent>
    </Card>
  );
}
