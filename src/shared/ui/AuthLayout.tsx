import React, { useEffect, useState } from 'react';
import { usePathname, router } from 'expo-router';
import { useAuthStore } from '@/shared/store/auth.store';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { token, user } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Define auth pages (pages that should redirect if user is already authenticated)
  const authPages = ['/log-in', '/sign-up', '/forgot-password', '/'];
  
  // Define protected pages (pages that require authentication)
  const protectedPages = ['/(tabs)/dashboard', '/settings'];
  
  const isAuthPage = authPages.includes(pathname);
  const isProtectedPage = protectedPages.includes(pathname);
  const isAuthenticated = !!(token && user);
  
  useEffect(() => {
    if (isNavigating) return;

    // If on auth page and already authenticated, redirect to dashboard
    if (isAuthPage && isAuthenticated) {
      setIsNavigating(true);
      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
        setIsNavigating(false);
      }, 100);
    }
    
    // If on protected page and not authenticated, redirect to login
    if (isProtectedPage && !isAuthenticated) {
      setIsNavigating(true);
      setTimeout(() => {
        router.replace('/log-in');
        setIsNavigating(false);
      }, 100);
    }
  }, [pathname, isAuthenticated, isAuthPage, isProtectedPage, isNavigating]);
  
  return <>{children}</>;
};
