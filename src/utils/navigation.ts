import { useRouter } from 'expo-router';

/**
 * Custom hook for safe navigation with back button functionality
 * @param fallbackRoute - Route to navigate to if can't go back (default: '/')
 * @returns Object with canGoBack boolean and handleGoBack function
 */
export const useSafeNavigation = (fallbackRoute: string = '/') => {
  const router = useRouter();
  
  // Check if we can go back
  const canGoBack = router.canGoBack();

  // Safe back function that handles errors
  const handleGoBack = () => {
    try {
      if (canGoBack) {
        router.back();
      } else {
        // If can't go back, navigate to fallback route
        router.push(fallbackRoute as any);
      }
    } catch (error) {
      // Fallback to specified route if back fails
      router.push(fallbackRoute as any);
    }
  };

  return {
    canGoBack,
    handleGoBack,
  };
};
