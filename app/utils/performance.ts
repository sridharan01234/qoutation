// utils/performance.ts
export const measurePerformance = (label: string) => {
  if (typeof performance !== 'undefined') {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.debug(`${label} took ${end - start}ms`);
    };
  }
  return () => {};
};

export const deferredExecution = (fn: Function, delay: number = 0) => {
  if (typeof window !== 'undefined') {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => setTimeout(fn, delay));
    } else {
      setTimeout(fn, delay);
    }
  }
};

export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function (...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};