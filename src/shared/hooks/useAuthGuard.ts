import { useEffect, useState } from 'react';
import { router, useRouter } from 'expo-router';
import { useAuthStore } from '@/shared/store/auth.store';

export const useAuthGuard = (redirectTo: string = '/(tabs)/dashboard') => {
  const { token, user } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (token && user && !isNavigating) {
      setIsNavigating(true);
      // Add a small delay to ensure navigation is ready
      setTimeout(() => {
        router.replace(redirectTo);
      }, 100);
    }
  }, [token, user, redirectTo, isNavigating]);

  return {
    isAuthenticated: !!(token && user),
    isLoading: isNavigating,
  };
};

export const useUnauthGuard = (redirectTo: string = '/log-in') => {
  const { token, user } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if ((!token || !user) && !isNavigating) {
      setIsNavigating(true);
      // Add a small delay to ensure navigation is ready
      setTimeout(() => {
        router.replace(redirectTo);
      }, 100);
    }
  }, [token, user, redirectTo, isNavigating]);

  return {
    isUnauthenticated: !(token && user),
    isLoading: isNavigating,
  };
};

export const useAuth = () => {
  const { token, user } = useAuthStore();

  return {
    isAuthenticated: !!(token && user),
  };
};
