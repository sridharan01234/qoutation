type AnyFunction = (...args: any[]) => any;

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

export const deferredExecution = <T extends AnyFunction>(fn: T, delay: number = 0): void => {
  if (typeof window !== 'undefined') {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => setTimeout(() => fn(), delay));
    } else {
      setTimeout(() => fn(), delay);
    }
  }
};

export const throttle = <T extends AnyFunction>(func: T, limit: number): T => {
  let inThrottle: boolean;
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!inThrottle) {
      const result = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      return result;
    }
    return undefined as ReturnType<T>;
  } as T;
};

export const debounce = <T extends AnyFunction>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout;
  
  return function(this: any, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
};
