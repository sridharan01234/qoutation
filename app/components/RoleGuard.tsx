// components/RoleGuard.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type RoleGuardProps = {
  children: React.ReactNode
  allowedRoles: Array<'ADMIN' | 'MANAGER' | 'USER'>
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !allowedRoles.includes(user?.role)) {
      router.push('/dashboard')
    }
  }, [user, isLoading, allowedRoles, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!allowedRoles.includes(user?.role)) {
    return null
  }

  return <>{children}</>
}
