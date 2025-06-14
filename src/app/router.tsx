'use client'

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from "../lib/auth"
import { Navbar } from "../components/navbar"
import { FullPageLoader } from "../components/ui/loading-spinner"
import Landing from "../../pages/landing"
import Auth from "../../pages/auth"
import BuyerDashboard from "../../pages/buyer-dashboard"
import BuyerOrders from "../../pages/buyer-orders"
import SellerDashboard from "../../pages/seller-dashboard"
import NotFound from "../../pages/not-found"

export default function AppRouter() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  useEffect(() => {
    if (!isLoading) {
      // Handle redirects for authenticated users
      if (isAuthenticated && user) {
        if (pathname === '/' || pathname === '/auth') {
          router.push(user.role === "buyer" ? "/buyer" : "/seller")
        }
      }
      // Handle redirects for unauthenticated users
      else if (!isAuthenticated) {
        if (pathname !== '/' && pathname !== '/auth') {
          router.push('/auth')
        }
      }
    }
  }, [isAuthenticated, user, isLoading, pathname, router])

  if (isLoading) {
    return <FullPageLoader />
  }

  const renderPage = () => {
    switch (pathname) {
      case '/':
        return !isAuthenticated ? <Landing /> : null
      case '/auth':
        return !isAuthenticated ? <Auth /> : null
      case '/buyer':
        return isAuthenticated && user?.role === 'buyer' ? <BuyerDashboard /> : null
      case '/orders':
        return isAuthenticated && user?.role === 'buyer' ? <BuyerOrders /> : null
      case '/seller':
        return isAuthenticated && user?.role === 'seller' ? <SellerDashboard /> : null
      default:
        return <NotFound />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  )
}