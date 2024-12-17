// app/dashboard/page.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import { Suspense } from 'react'

function DashboardContent() {
  const { user, isAdmin, isManager, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.name}
      </h1>
      
      {isAdmin && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
          {/* Admin only content */}
        </div>
      )}

      {isManager && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Manager Controls</h2>
          {/* Manager only content */}
        </div>
      )}

      {/* Regular user content */}
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
