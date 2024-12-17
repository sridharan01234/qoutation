// providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: any
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isManager: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isManager: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if the current route requires authentication
    const isAuthRoute = pathname.startsWith('/dashboard') || 
                       pathname.startsWith('/admin') || 
                       pathname.startsWith('/profile')

    const isPublicRoute = pathname === '/login' || 
                         pathname === '/register' || 
                         pathname === '/'

    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    setIsLoading(false)

    if (!session && isAuthRoute) {
      router.push('/login')
    } else if (session && isPublicRoute) {
      router.push('/dashboard')
    }
  }, [session, status, pathname, router])

  const value = {
    user: session?.user,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === 'ADMIN',
    isManager: ['ADMIN', 'MANAGER'].includes(session?.user?.role ?? ''),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
