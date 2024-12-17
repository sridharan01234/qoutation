// hooks/useAuth.ts
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'  // Changed from 'next/router'
import { useEffect } from 'react'

export function useAuth(requireAuth = true) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const loading = status === 'loading'
  const authenticated = !!session

  useEffect(() => {
    if (!loading && requireAuth && !authenticated) {
      router.push('/login')
    }
  }, [loading, authenticated, requireAuth, router])

  return {
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    user: session?.user,
    isAdmin: session?.user?.role === 'ADMIN',
    isManager: ['ADMIN', 'MANAGER'].includes(session?.user?.role ?? ''),
  }
}
