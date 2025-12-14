import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSweets } from '@/hooks/useSweets';
import type { SweetCategory } from '@/types/api.types';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function SearchFilters() {
  const { searchParams, setSearchParams, categories, filteredSweets, sweets } = useSweets();
  const [showFilters, setShowFilters] = useState(false);

  const handleNameSearch = (value: string) => {
    setSearchParams({ ...searchParams, name: value || undefined });
  };

  const handleCategoryChange = (value: string) => {
    setSearchParams({
      ...searchParams,
      category: value === 'all' ? undefined : (value as SweetCategory),
    });
  };

  const handleMinPriceChange = (value: string) => {
    const num = parseFloat(value);
    setSearchParams({
      ...searchParams,
      minPrice: isNaN(num) ? undefined : num,
    });
  };

  const handleMaxPriceChange = (value: string) => {
    const num = parseFloat(value);
    setSearchParams({
      ...searchParams,
      maxPrice: isNaN(num) ? undefined : num,
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = searchParams.name || searchParams.category || 
    searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={searchParams.name || ''}
            onChange={(e) => handleNameSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2 text-muted-foreground">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg border border-border animate-fade-in">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select
              value={searchParams.category || 'all'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Min Price ($)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={searchParams.minPrice ?? ''}
              onChange={(e) => handleMinPriceChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Max Price ($)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="999.99"
              value={searchParams.maxPrice ?? ''}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredSweets.length} of {sweets.length} sweets
        {hasActiveFilters && ' (filtered)'}
      </p>
    </div>
  );
}
