import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { Navbar } from '@/components/navbar';

// Import pages
import HomePage from '../app/page';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Router>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
                  <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
                </div>
              </Route>
            </Switch>
          </Router>
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;