// app/dashboard/page.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import { Suspense } from 'react'
import { useRouter } from 'next/navigation'

function DashboardContent() {
  const { user, isAdmin, isManager, isLoading } = useAuth()
  const router = useRouter()

  router.push('/');
  
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6">
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  )
}
