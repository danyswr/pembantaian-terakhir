import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth';
import { Navbar } from '@/components/navbar';

// Import pages
import HomePage from '@/app/page';
import LoginPage from '@/app/auth/login/page';
import RegisterPage from '@/app/auth/register/page';
import BuyerDashboard from '@/app/buyer/page';
import SellerDashboard from '@/app/seller/page';
import OrdersPage from '@/app/orders/page';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ecomarket-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/buyer" element={<BuyerDashboard />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;