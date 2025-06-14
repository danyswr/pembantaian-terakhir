import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { FullPageLoader } from "@/components/ui/loading-spinner";
import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import BuyerDashboard from "@/pages/buyer-dashboard";
import BuyerOrders from "@/pages/buyer-orders";
import SellerDashboard from "@/pages/seller-dashboard";
import NotFound from "@/pages/not-found";
import { useState } from "react";

// Protected Route component
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles?: ("buyer" | "seller")[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Redirect to={user.role === "buyer" ? "/buyer" : "/seller"} />;
  }

  return <>{children}</>;
}

// Public Route component (redirects if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated && user) {
    return <Redirect to={user.role === "buyer" ? "/buyer" : "/seller"} />;
  }

  return <>{children}</>;
}

function Router() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Switch>
          {/* Public Routes */}
          <Route path="/">
            <PublicRoute>
              <Landing />
            </PublicRoute>
          </Route>
          
          <Route path="/auth">
            <PublicRoute>
              <Auth />
            </PublicRoute>
          </Route>

          {/* Protected Routes */}
          <Route path="/buyer">
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerDashboard />
            </ProtectedRoute>
          </Route>

          <Route path="/orders">
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerOrders />
            </ProtectedRoute>
          </Route>

          <Route path="/seller">
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          </Route>

          {/* Catch all - 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
