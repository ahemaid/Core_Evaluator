// API service for ServicePro frontend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  count?: number;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    pages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'user' | 'provider' | 'admin' | 'evaluator';
  language?: 'en' | 'de' | 'ar';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    language: string;
    isApproved: boolean | string;
    rewardPoints: number;
  };
}

// Service Provider types
export interface ServiceProvider {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  subcategory: string;
  location: string;
  country: string;
  experience: number;
  rating: number;
  reviewCount: number;
  price: number;
  priceUnit: string;
  waitTime: string;
  photo: string;
  badges: string[];
  isVerified: boolean;
  isActive: boolean;
  isApproved: boolean | string;
  bio: string;
  credentials: string[];
  languages: string[];
  serviceHours: string;
  website?: string;
  availability?: { day: string; start: string; end: string }[];
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: { name: string; originalName: string }[];
  description: string;
  image: string;
  color: string;
  providerCount: number;
}

// Blog Post types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  image: string;
  category: string;
  tags: string[];
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  slug: string;
}

// Utility function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Utility function to set auth token
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Utility function to remove auth token
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Base fetch function with error handling
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthResponse['user']>> => {
    return apiRequest<AuthResponse['user']>('/auth/me');
  },

  updateProfile: async (profileData: Partial<AuthResponse['user']>): Promise<ApiResponse<AuthResponse['user']>> => {
    return apiRequest<AuthResponse['user']>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
    return apiRequest<null>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  logout: (): void => {
    removeAuthToken();
  },
};

// Service Providers API
export const serviceProvidersApi = {
  getAll: async (params?: {
    category?: string;
    subcategory?: string;
    location?: string;
    country?: string;
    minRating?: number;
    maxPrice?: number;
    sortBy?: 'rating' | 'price' | 'reviewCount' | 'newest';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ServiceProvider[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/service-providers${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<ServiceProvider[]>(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse<ServiceProvider>> => {
    return apiRequest<ServiceProvider>(`/service-providers/${id}`);
  },

  create: async (providerData: Omit<ServiceProvider, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ServiceProvider>> => {
    return apiRequest<ServiceProvider>('/service-providers', {
      method: 'POST',
      body: JSON.stringify(providerData),
    });
  },

  update: async (id: string, providerData: Partial<ServiceProvider>): Promise<ApiResponse<ServiceProvider>> => {
    return apiRequest<ServiceProvider>(`/service-providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(providerData),
    });
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiRequest<null>(`/service-providers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (language: string = 'ar'): Promise<ApiResponse<ServiceCategory[]>> => {
    return apiRequest<ServiceCategory[]>(`/categories?language=${language}`);
  },

  getById: async (id: string, language: string = 'ar'): Promise<ApiResponse<ServiceCategory>> => {
    return apiRequest<ServiceCategory>(`/categories/${id}?language=${language}`);
  },
};

// Blog Posts API
export const blogPostsApi = {
  getAll: async (params?: {
    status?: 'draft' | 'published' | 'archived';
    category?: string;
    featured?: boolean;
    author?: string;
    page?: number;
    limit?: number;
    language?: string;
  }): Promise<ApiResponse<BlogPost[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/blog-posts${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<BlogPost[]>(endpoint);
  },

  getFeatured: async (limit: number = 5, language: string = 'ar'): Promise<ApiResponse<BlogPost[]>> => {
    return apiRequest<BlogPost[]>(`/blog-posts/featured?limit=${limit}&language=${language}`);
  },

  getById: async (id: string, language: string = 'ar'): Promise<ApiResponse<BlogPost>> => {
    return apiRequest<BlogPost>(`/blog-posts/${id}?language=${language}`);
  },

  getBySlug: async (slug: string, language: string = 'ar'): Promise<ApiResponse<BlogPost>> => {
    return apiRequest<BlogPost>(`/blog-posts/slug/${slug}?language=${language}`);
  },

  like: async (id: string): Promise<ApiResponse<{ likeCount: number }>> => {
    return apiRequest<{ likeCount: number }>(`/blog-posts/${id}/like`, {
      method: 'POST',
    });
  },
};

// File Upload API
export const fileUploadApi = {
  uploadProviderPhoto: async (file: File, providerId?: string): Promise<{ success: boolean; fileUrl: string; filename: string; size: number }> => {
    const formData = new FormData();
    formData.append('photo', file);
    if (providerId) {
      formData.append('providerId', providerId);
    }

    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/upload-provider-photo`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  },

  uploadReceipt: async (file: File, appointmentId?: string): Promise<{ success: boolean; fileUrl: string; filename: string; size: number }> => {
    const formData = new FormData();
    formData.append('receipt', file);
    if (appointmentId) {
      formData.append('appointmentId', appointmentId);
    }

    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/upload-receipt`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  },
};

// Export utility functions
export { getAuthToken, setAuthToken, removeAuthToken };
