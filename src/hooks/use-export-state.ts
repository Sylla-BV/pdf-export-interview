import { ExportStatus } from '@/types/pdf-export';
import { useMemo, useState, useEffect } from 'react';

import { useTriggerExport, useLatestExport, useExportStatus } from './use-pdf-export';

export function useExportState() {
  const triggerExportMutation = useTriggerExport();
  const { data: latestExportData, error: latestExportError } = useLatestExport();
  const { data: currentExportData, error: currentExportError } = useExportStatus();

  const [isExportLoading, setIsExportLoading] = useState(false);

  useEffect(() => {
    const activeExportData = currentExportData || latestExportData;

    if (
      isExportLoading &&
      !triggerExportMutation.isPending &&
      (activeExportData?.status === ExportStatus.COMPLETED ||
        activeExportData?.status === ExportStatus.FAILED)
    ) {
      setIsExportLoading(false);
    }
  }, [triggerExportMutation.isPending, currentExportData, latestExportData, isExportLoading]);

  const exportState = useMemo(() => {
    const activeExportData = currentExportData || latestExportData;
    const activeExportError = currentExportError || latestExportError;

    const isExportCompleted = activeExportData?.status === ExportStatus.COMPLETED;
    const isExportInProgress =
      triggerExportMutation.isPending ||
      activeExportData?.status === ExportStatus.PENDING ||
      activeExportData?.status === ExportStatus.PROCESSING;

    const isLinkActive =
      isExportCompleted &&
      activeExportData?.expiresAt &&
      new Date(activeExportData.expiresAt) > new Date();

    const shouldDisableButton = isExportInProgress || isLinkActive;

    const hasError = triggerExportMutation.isError || !!activeExportError;

    return {
      activeExportData,
      activeExportError,
      isExportCompleted,
      isExportInProgress,
      isLinkActive,
      shouldDisableButton,
      hasError,
      errorMessage: triggerExportMutation.error?.message || activeExportError?.message,
    };
  }, [
    currentExportData,
    latestExportData,
    currentExportError,
    latestExportError,
    triggerExportMutation.isPending,
    triggerExportMutation.isError,
    triggerExportMutation.error,
  ]);

  const startExportLoading = () => {
    setIsExportLoading(true);
  };

  return {
    ...exportState,
    triggerExport: triggerExportMutation.mutate,
    startExportLoading,
    isTriggering: triggerExportMutation.isPending || isExportLoading,
  };
}
