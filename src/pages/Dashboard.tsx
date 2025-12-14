import { useAuth } from '@/hooks/useAuth';
import { SweetsProvider } from '@/hooks/useSweets';
import Header from '@/components/layout/Header';
import SearchFilters from '@/components/sweets/SearchFilters';
import SweetsGrid from '@/components/sweets/SweetsGrid';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-candy mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SweetsProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Sweet Collection
            </h1>
            <p className="text-muted-foreground mt-2">
              {user?.role === 'ADMIN' 
                ? 'Manage your inventory and track stock levels'
                : 'Browse our delicious selection of sweets and treats'
              }
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8">
            <SearchFilters />
          </div>

          {/* Sweets Grid */}
          <SweetsGrid />
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-card/30 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Sweet Shop Management System</p>
          </div>
        </footer>
      </div>
    </SweetsProvider>
  );
}
