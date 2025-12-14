// ==========================================
// API Types & Interfaces
// Ready for Node.js/Express backend integration
// ==========================================

// User & Authentication Types
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Auth Request/Response Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Sweet Types
export interface Sweet {
  id: string;
  name: string;
  category: SweetCategory;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type SweetCategory = 
  | 'chocolates'
  | 'candies'
  | 'cookies'
  | 'cakes'
  | 'pastries'
  | 'ice-cream'
  | 'traditional';

export interface CreateSweetRequest {
  name: string;
  category: SweetCategory;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

export interface UpdateSweetRequest {
  name?: string;
  category?: SweetCategory;
  price?: number;
  quantity?: number;
  description?: string;
  imageUrl?: string;
}

// Search & Filter Types
export interface SweetSearchParams {
  name?: string;
  category?: SweetCategory;
  minPrice?: number;
  maxPrice?: number;
}

// Inventory Types
export interface PurchaseResponse {
  success: boolean;
  message: string;
  remainingQuantity: number;
}

export interface RestockRequest {
  quantity: number;
}

export interface RestockResponse {
  success: boolean;
  message: string;
  newQuantity: number;
}

// API Error Response
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: true;
  data: T;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
