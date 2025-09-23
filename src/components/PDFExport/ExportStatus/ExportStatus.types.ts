import { ExportStatus } from '@/types/pdf-export';

export interface StatusConfig {
  icon: React.ReactNode;
  label: string;
  variant: 'default' | 'destructive';
  className: string;
}

export interface ExportStatusProps {
  status: ExportStatus;
  errorMessage?: string;
}
