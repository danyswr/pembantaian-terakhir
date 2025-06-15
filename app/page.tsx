'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Landing from '@/pages/landing'
import { FullPageLoader } from '@/components/ui/loading-spinner'

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
      if (user.role === 'buyer') {
        router.push('/buyer')
      } else if (user.role === 'seller') {
        router.push('/seller')
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return <FullPageLoader />
  }

  // Show landing page for non-authenticated users
  return <Landing />
}