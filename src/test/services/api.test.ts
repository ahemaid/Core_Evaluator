import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authApi, serviceProvidersApi, categoriesApi, blogPostsApi } from '../../services/api';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Auth API', () => {
    describe('login', () => {
      it('should login successfully and store token', async () => {
        const mockResponse = {
          success: true,
          data: {
            token: 'new-token',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              language: 'ar',
              isApproved: true,
              rewardPoints: 100,
            }
          }
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await authApi.login({
          email: 'test@example.com',
          password: 'password123'
        });

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123'
            }),
          })
        );

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', 'new-token');
        expect(result).toEqual(mockResponse);
      });

      it('should handle login failure', async () => {
        const mockResponse = {
          success: false,
          message: 'Invalid credentials'
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          json: async () => mockResponse,
        });

        await expect(authApi.login({
          email: 'test@example.com',
          password: 'wrongpassword'
        })).rejects.toThrow('Invalid credentials');
      });
    });

    describe('register', () => {
      it('should register successfully and store token', async () => {
        const mockResponse = {
          success: true,
          data: {
            token: 'new-token',
            user: {
              id: '1',
              name: 'New User',
              email: 'new@example.com',
              role: 'user',
              language: 'ar',
              isApproved: 'pending',
              rewardPoints: 0,
            }
          }
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await authApi.register({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123',
          phone: '+1234567890',
          role: 'user',
          language: 'ar'
        });

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/register',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'New User',
              email: 'new@example.com',
              password: 'password123',
              phone: '+1234567890',
              role: 'user',
              language: 'ar'
            }),
          })
        );

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', 'new-token');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getCurrentUser', () => {
      it('should get current user with token', async () => {
        const mockResponse = {
          success: true,
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user',
            language: 'ar',
            isApproved: true,
            rewardPoints: 100,
          }
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await authApi.getCurrentUser();

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/me',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer mock-token',
            },
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe('logout', () => {
      it('should remove token from localStorage', () => {
        authApi.logout();
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      });
    });
  });

  describe('Service Providers API', () => {
    describe('getAll', () => {
      it('should fetch service providers with filters', async () => {
        const mockResponse = {
          success: true,
          data: [
            {
              _id: '1',
              name: 'Dr. Test',
              category: 'healthcare',
              rating: 4.5,
              price: 100,
            }
          ],
          count: 1,
          total: 1,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await serviceProvidersApi.getAll({
          category: 'healthcare',
          minRating: 4.0,
          page: 1,
          limit: 10
        });

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/service-providers?category=healthcare&minRating=4&page=1&limit=10',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );

        expect(result).toEqual(mockResponse);
      });

      it('should fetch service providers without filters', async () => {
        const mockResponse = {
          success: true,
          data: [],
          count: 0,
          total: 0,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await serviceProvidersApi.getAll();

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/service-providers',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe('getById', () => {
      it('should fetch single service provider', async () => {
        const mockResponse = {
          success: true,
          data: {
            _id: '1',
            name: 'Dr. Test',
            category: 'healthcare',
            rating: 4.5,
            price: 100,
          }
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await serviceProvidersApi.getById('1');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/service-providers/1',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Categories API', () => {
    describe('getAll', () => {
      it('should fetch categories with language', async () => {
        const mockResponse = {
          success: true,
          data: [
            {
              id: 'healthcare',
              name: 'الرعاية الصحية',
              icon: 'Heart',
              subcategories: [
                { name: 'طب القلب', originalName: 'Cardiology' }
              ],
            }
          ],
          count: 1,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await categoriesApi.getAll('ar');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/categories?language=ar',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Blog Posts API', () => {
    describe('getFeatured', () => {
      it('should fetch featured blog posts', async () => {
        const mockResponse = {
          success: true,
          data: [
            {
              id: '1',
              title: 'Test Blog Post',
              excerpt: 'Test excerpt',
              author: 'Test Author',
              image: 'test-image.jpg',
              publishedAt: '2024-01-01',
              viewCount: 100,
              likeCount: 50,
            }
          ],
          count: 1,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await blogPostsApi.getFeatured(5, 'ar');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/blog-posts/featured?limit=5&language=ar',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe('like', () => {
      it('should like a blog post', async () => {
        const mockResponse = {
          success: true,
          likeCount: 51,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await blogPostsApi.like('1');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/blog-posts/1/like',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer mock-token',
            },
          })
        );

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(authApi.login({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Network error');
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Server error'
        }),
      });

      await expect(authApi.login({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Server error');
    });
  });
});
