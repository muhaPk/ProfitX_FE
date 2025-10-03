import { useCallback, useRef, useState, useEffect } from 'react';

export const useTimeout = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const delay = useCallback(async (callbackOrDelay: (() => void | Promise<void>) | number, delay?: number) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set executing immediately
    setIsExecuting(true);
    
    // Determine if first argument is callback or delay
    const actualCallback = typeof callbackOrDelay === 'function' ? callbackOrDelay : () => {};
    const actualDelay = typeof callbackOrDelay === 'number' ? callbackOrDelay : delay!;
    
    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await actualCallback();
      } catch (error) {
        console.error('Timeout callback error:', error);
      } finally {
        setIsExecuting(false);
      }
    }, actualDelay);
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { 
    delay, 
    isExecuting
  };
};
