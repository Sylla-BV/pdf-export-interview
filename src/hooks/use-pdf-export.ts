import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/lib/constants';
import type { CreateExportResponse, ExportStatusResponse } from '@/types/pdf-export';

// Hook for triggering PDF export
export function useTriggerExport() {
  const queryClient = useQueryClient();
  
  return useMutation<CreateExportResponse, Error, void>({
    mutationFn: async () => {
      const response = await fetch(API_ENDPOINTS.EXPORT_PDF, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to trigger export');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store the export ID in React Query cache
      queryClient.setQueryData(['current-export-id'], data.id);
    },
  });
}


// Hook to get the latest export from database (called only once)
export function useLatestExport() {
  return useQuery<ExportStatusResponse | null, Error>({
    queryKey: ['latest-export'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.EXPORTS_LATEST);
      if (!response.ok) {
        throw new Error('Failed to fetch latest export');
      }
      const data = await response.json();
      return data; // This can be null if no exports exist
    },
    // No polling - only fetch once when component mounts
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}

// Hook for getting export status (light polling when pending)
export function useExportStatus() {
  const queryClient = useQueryClient();
  const exportId = queryClient.getQueryData<number>(['current-export-id']);
  
  return useQuery<ExportStatusResponse | null, Error>({
    queryKey: ['export-status', exportId],
    queryFn: async () => {
      if (!exportId) throw new Error('No export ID available');
      
      const response = await fetch(API_ENDPOINTS.EXPORTS_BY_ID(exportId));
      if (!response.ok) {
        throw new Error('Failed to fetch export status');
      }
      const data = await response.json();
      return data; // This can be null if export doesn't exist
    },
    enabled: !!exportId,
    // Light polling only when status is pending
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'pending') {
        return 1000; // Poll every 1 second when pending
      }
      return false; // Stop polling for completed/failed/processing
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
}
