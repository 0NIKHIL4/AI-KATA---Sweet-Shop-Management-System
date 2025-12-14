import { useSweets } from '@/hooks/useSweets';
import SweetCard from './SweetCard';
import { Loader2, Package } from 'lucide-react';

export default function SweetsGrid() {
  const { filteredSweets, isLoading, error } = useSweets();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-muted-foreground">Loading sweets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Package className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Failed to load sweets</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredSweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">No sweets found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSweets.map((sweet, index) => (
        <div
          key={sweet.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-slide-up"
        >
          <SweetCard sweet={sweet} />
        </div>
      ))}
    </div>
  );
}
