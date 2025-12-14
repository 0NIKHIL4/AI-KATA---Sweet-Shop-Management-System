// ==========================================
// API Service Layer
// Centralized API calls - Ready for backend integration
// ==========================================

import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Sweet,
  CreateSweetRequest,
  UpdateSweetRequest,
  SweetSearchParams,
  PurchaseResponse,
  RestockRequest,
  RestockResponse,
  ApiResponse,
  ApiErrorResponse,
} from '@/types/api.types';

// Configuration - Update this when connecting to your backend
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
};

// Token management
const TOKEN_KEY = 'sweet_shop_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Base fetch wrapper with auth headers
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiErrorResponse;
    throw new Error(error.error?.message || 'An error occurred');
  }

  return data as T;
}

// ==========================================
// Authentication API
// ==========================================

export const authApi = {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiFetch<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * POST /api/auth/login
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiFetch<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await apiFetch<ApiResponse<AuthResponse['user']>>('/auth/me');
    return response.data;
  },
};

// ==========================================
// Sweets API
// ==========================================

export const sweetsApi = {
  /**
   * GET /api/sweets
   * List all sweets
   */
  getAll: async (): Promise<Sweet[]> => {
    const response = await apiFetch<ApiResponse<Sweet[]>>('/sweets');
    return response.data;
  },

  /**
   * GET /api/sweets/:id
   * Get a single sweet by ID
   */
  getById: async (id: string): Promise<Sweet> => {
    const response = await apiFetch<ApiResponse<Sweet>>(`/sweets/${id}`);
    return response.data;
  },

  /**
   * GET /api/sweets/search
   * Search sweets with filters
   */
  search: async (params: SweetSearchParams): Promise<Sweet[]> => {
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice !== undefined) queryParams.append('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) queryParams.append('maxPrice', String(params.maxPrice));

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/sweets/search?${queryString}` : '/sweets/search';
    
    const response = await apiFetch<ApiResponse<Sweet[]>>(endpoint);
    return response.data;
  },

  /**
   * POST /api/sweets
   * Create a new sweet (Admin only)
   */
  create: async (data: CreateSweetRequest): Promise<Sweet> => {
    const response = await apiFetch<ApiResponse<Sweet>>('/sweets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * PUT /api/sweets/:id
   * Update a sweet
   */
  update: async (id: string, data: UpdateSweetRequest): Promise<Sweet> => {
    const response = await apiFetch<ApiResponse<Sweet>>(`/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * DELETE /api/sweets/:id
   * Delete a sweet (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    await apiFetch<ApiResponse<null>>(`/sweets/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// Inventory API
// ==========================================

export const inventoryApi = {
  /**
   * POST /api/sweets/:id/purchase
   * Purchase a sweet (decreases quantity by 1)
   */
  purchase: async (sweetId: string): Promise<PurchaseResponse> => {
    const response = await apiFetch<ApiResponse<PurchaseResponse>>(
      `/sweets/${sweetId}/purchase`,
      { method: 'POST' }
    );
    return response.data;
  },

  /**
   * POST /api/sweets/:id/restock
   * Restock a sweet (Admin only)
   */
  restock: async (sweetId: string, data: RestockRequest): Promise<RestockResponse> => {
    const response = await apiFetch<ApiResponse<RestockResponse>>(
      `/sweets/${sweetId}/restock`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },
};
