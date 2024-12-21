import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// Hook for debounced search
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Hook for infinite scrolling
export const useInfiniteScroll = (callback: () => void, options = {}) => {
  const [ref, inView] = useInView({
    threshold: 0,
    ...options,
  });

  useEffect(() => {
    if (inView) {
      callback();
    }
  }, [inView, callback]);

  return ref;
};

// Hook for window size optimization
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};