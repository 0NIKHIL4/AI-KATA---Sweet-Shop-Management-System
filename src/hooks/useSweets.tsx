import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Sweet, CreateSweetRequest, UpdateSweetRequest, SweetSearchParams, SweetCategory } from '@/types/api.types';
import { sweetsApi, inventoryApi } from '@/services/api.service';

// Mock data for demo - Remove when connecting to real backend
const MOCK_SWEETS: Sweet[] = [
  {
    id: '1',
    name: 'Belgian Dark Chocolate',
    category: 'chocolates',
    price: 12.99,
    quantity: 25,
    description: 'Rich, velvety dark chocolate imported from Belgium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Strawberry Macarons',
    category: 'pastries',
    price: 8.50,
    quantity: 15,
    description: 'Delicate French macarons with strawberry filling',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Caramel Fudge',
    category: 'candies',
    price: 6.99,
    quantity: 40,
    description: 'Handmade buttery caramel fudge squares',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Vanilla Bean Cupcake',
    category: 'cakes',
    price: 4.50,
    quantity: 0,
    description: 'Fluffy vanilla cupcake with buttercream frosting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Chocolate Chip Cookies',
    category: 'cookies',
    price: 3.99,
    quantity: 50,
    description: 'Classic homemade cookies with premium chocolate chips',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Mango Sorbet',
    category: 'ice-cream',
    price: 5.99,
    quantity: 20,
    description: 'Refreshing tropical mango sorbet',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Gulab Jamun',
    category: 'traditional',
    price: 7.50,
    quantity: 30,
    description: 'Classic Indian sweet dumplings in rose syrup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Salted Caramel Truffles',
    category: 'chocolates',
    price: 14.99,
    quantity: 3,
    description: 'Luxurious truffles with sea salt caramel center',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface SweetsContextType {
  sweets: Sweet[];
  filteredSweets: Sweet[];
  isLoading: boolean;
  error: string | null;
  searchParams: SweetSearchParams;
  categories: SweetCategory[];
  setSearchParams: (params: SweetSearchParams) => void;
  fetchSweets: () => Promise<void>;
  createSweet: (data: CreateSweetRequest) => Promise<Sweet>;
  updateSweet: (id: string, data: UpdateSweetRequest) => Promise<Sweet>;
  deleteSweet: (id: string) => Promise<void>;
  purchaseSweet: (id: string) => Promise<void>;
  restockSweet: (id: string, quantity: number) => Promise<void>;
}

const SweetsContext = createContext<SweetsContextType | undefined>(undefined);

// Flag to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true;

const CATEGORIES: SweetCategory[] = [
  'chocolates',
  'candies',
  'cookies',
  'cakes',
  'pastries',
  'ice-cream',
  'traditional',
];

export function SweetsProvider({ children }: { children: ReactNode }) {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SweetSearchParams>({});

  // Filter sweets based on search params
  const filteredSweets = sweets.filter(sweet => {
    if (searchParams.name && !sweet.name.toLowerCase().includes(searchParams.name.toLowerCase())) {
      return false;
    }
    if (searchParams.category && sweet.category !== searchParams.category) {
      return false;
    }
    if (searchParams.minPrice !== undefined && sweet.price < searchParams.minPrice) {
      return false;
    }
    if (searchParams.maxPrice !== undefined && sweet.price > searchParams.maxPrice) {
      return false;
    }
    return true;
  });

  const fetchSweets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setSweets([...MOCK_SWEETS]);
      } else {
        const data = await sweetsApi.getAll();
        setSweets(data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch sweets';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSweet = useCallback(async (data: CreateSweetRequest): Promise<Sweet> => {
    if (USE_MOCK_DATA) {
      const newSweet: Sweet = {
        id: String(Date.now()),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSweets(prev => [...prev, newSweet]);
      return newSweet;
    } else {
      const newSweet = await sweetsApi.create(data);
      setSweets(prev => [...prev, newSweet]);
      return newSweet;
    }
  }, []);

  const updateSweet = useCallback(async (id: string, data: UpdateSweetRequest): Promise<Sweet> => {
    if (USE_MOCK_DATA) {
      let updatedSweet: Sweet | undefined;
      setSweets(prev => prev.map(sweet => {
        if (sweet.id === id) {
          updatedSweet = { ...sweet, ...data, updatedAt: new Date().toISOString() };
          return updatedSweet;
        }
        return sweet;
      }));
      if (!updatedSweet) throw new Error('Sweet not found');
      return updatedSweet;
    } else {
      const updated = await sweetsApi.update(id, data);
      setSweets(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    }
  }, []);

  const deleteSweet = useCallback(async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      setSweets(prev => prev.filter(s => s.id !== id));
    } else {
      await sweetsApi.delete(id);
      setSweets(prev => prev.filter(s => s.id !== id));
    }
  }, []);

  const purchaseSweet = useCallback(async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      setSweets(prev => prev.map(sweet => {
        if (sweet.id === id) {
          if (sweet.quantity <= 0) {
            throw new Error('Out of stock');
          }
          return { ...sweet, quantity: sweet.quantity - 1, updatedAt: new Date().toISOString() };
        }
        return sweet;
      }));
    } else {
      await inventoryApi.purchase(id);
      await fetchSweets(); // Refresh to get updated quantity
    }
  }, [fetchSweets]);

  const restockSweet = useCallback(async (id: string, quantity: number): Promise<void> => {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    if (USE_MOCK_DATA) {
      setSweets(prev => prev.map(sweet => {
        if (sweet.id === id) {
          return { ...sweet, quantity: sweet.quantity + quantity, updatedAt: new Date().toISOString() };
        }
        return sweet;
      }));
    } else {
      await inventoryApi.restock(id, { quantity });
      await fetchSweets();
    }
  }, [fetchSweets]);

  // Fetch sweets on mount
  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const value: SweetsContextType = {
    sweets,
    filteredSweets,
    isLoading,
    error,
    searchParams,
    categories: CATEGORIES,
    setSearchParams,
    fetchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
  };

  return <SweetsContext.Provider value={value}>{children}</SweetsContext.Provider>;
}

export function useSweets() {
  const context = useContext(SweetsContext);
  if (context === undefined) {
    throw new Error('useSweets must be used within a SweetsProvider');
  }
  return context;
}
