'use client'

import { SessionProvider } from './providers/SessionProvider'
import { AuthProvider } from './providers/AuthProvider'
import { CartProvider } from './context/CartContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}