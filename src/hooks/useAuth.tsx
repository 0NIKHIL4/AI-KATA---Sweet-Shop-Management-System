import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest, UserRole } from '@/types/api.types';
import { authApi, setToken, removeToken, getToken } from '@/services/api.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// MOCK MODE - Set to false when backend is ready
// ============================================
const USE_MOCK_DATA = true;

// Mock user store (in-memory, resets on refresh)
// In production, this would be replaced by actual backend calls
const mockUserStore = new Map<string, { user: User; password: string }>();

// Initialize with demo users
mockUserStore.set('admin@sweetshop.com', {
  user: {
    id: 'usr_admin_001',
    name: 'Store Manager',
    email: 'admin@sweetshop.com',
    role: 'ADMIN' as UserRole,
    createdAt: new Date().toISOString(),
  },
  password: 'admin123',
});

mockUserStore.set('user@sweetshop.com', {
  user: {
    id: 'usr_customer_001',
    name: 'Jane Customer',
    email: 'user@sweetshop.com',
    role: 'USER' as UserRole,
    createdAt: new Date().toISOString(),
  },
  password: 'user123',
});

// Mock JWT generation (simplified for demo)
function generateMockToken(userId: string): string {
  const payload = { userId, exp: Date.now() + 24 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
}

function decodeMockToken(token: string): { userId: string; exp: number } | null {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      const token = getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        if (USE_MOCK_DATA) {
          const decoded = decodeMockToken(token);
          if (!decoded || decoded.exp < Date.now()) {
            removeToken();
            setIsLoading(false);
            return;
          }

          // Find user by ID in mock store
          for (const [, data] of mockUserStore) {
            if (data.user.id === decoded.userId) {
              setUser(data.user);
              break;
            }
          }
        } else {
          // Real API call
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch {
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const stored = mockUserStore.get(data.email.toLowerCase());
        
        if (!stored || stored.password !== data.password) {
          throw new Error('Invalid email or password');
        }

        const token = generateMockToken(stored.user.id);
        setToken(token);
        setUser(stored.user);
      } else {
        const response = await authApi.login(data);
        setToken(response.token);
        setUser(response.user);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const emailLower = data.email.toLowerCase();
        
        if (mockUserStore.has(emailLower)) {
          throw new Error('An account with this email already exists');
        }

        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: data.name,
          email: emailLower,
          role: 'USER', // New users are always regular users
          createdAt: new Date().toISOString(),
        };

        mockUserStore.set(emailLower, { user: newUser, password: data.password });
        
        const token = generateMockToken(newUser.id);
        setToken(token);
        setUser(newUser);
      } else {
        const response = await authApi.register(data);
        setToken(response.token);
        setUser(response.user);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setError(null);
  }, []);

  // Role check based on authenticated user data
  const isAdmin = user?.role === 'ADMIN';

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
