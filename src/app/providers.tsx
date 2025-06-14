'use client'

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { Toaster } from "../components/ui/toaster";
import { TooltipProvider } from "../components/ui/tooltip";
import { AuthProvider } from "../lib/auth";
import { Navbar } from "../components/navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  const handleSearch = (query: string) => {
    // Search functionality will be handled by individual pages
    console.log("Search query:", query);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar onSearch={handleSearch} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}