import { memo, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import { measurePerformance } from '../utils/performance';

// Dynamically import heavy providers
const CartProvider = dynamic(() => import('../context/CartContext').then(mod => mod.CartProvider), {
  ssr: false
});

const AuthProvider = dynamic(() => import('../context/AuthContext').then(mod => mod.AuthProvider), {
  ssr: false
});

interface OptimizedProvidersProps {
  children: ReactNode;
}

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const OptimizedProviders = memo(function OptimizedProviders({ children }: OptimizedProvidersProps) {
  const endRender = measurePerformance('Providers render');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
});

export default OptimizedProviders;