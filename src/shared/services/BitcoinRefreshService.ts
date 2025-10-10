import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/shared/store/auth.store';
import { useBitcoinService } from './BitcoinService';

export const useBitcoinRefreshService = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { depositAddress, token } = useAuthStore();
  
  // Use the shared Bitcoin service
  const { performRefresh } = useBitcoinService();

  // performRefresh function is now provided by the shared BitcoinService

  // Start the refresh service
  const startRefreshService = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(performRefresh, 30000); // 30 seconds
  };

  // Stop the refresh service
  const stopRefreshService = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Initialize and manage the refresh service
  useEffect(() => {
    // Only start refresh service for authenticated users with a deposit address
    if (token && depositAddress) {
      startRefreshService();
    } else {
      stopRefreshService();
    }

    // Cleanup on unmount
    return () => {
      stopRefreshService();
    };
  }, [token, depositAddress]);

  // Return manual refresh function for components that need it
  return {
    performRefresh,
    startRefreshService,
    stopRefreshService
  };
};
