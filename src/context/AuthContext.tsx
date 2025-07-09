import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ServiceProvider } from '../types';
import { mockProviders } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateLanguage: (language: 'en' | 'de' | 'ar') => void;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add evaluator login support
      if (role === 'evaluator' && email === 'evaluator@example.com' && password === 'password123') {
        const evaluatorUser: User = {
          id: 'evaluator-1',
          email,
          name: 'Expert Evaluator',
          phone: '+1234567890',
          role: 'evaluator',
          rewardPoints: 0,
          createdAt: new Date().toISOString(),
          language: 'en',
        };
        setUser(evaluatorUser);
        localStorage.setItem('user', JSON.stringify(evaluatorUser));
        return true;
      }

      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        phone: '+1234567890',
        role: (role as any) || 'user',
        rewardPoints: 150,
        createdAt: new Date().toISOString(),
        language: 'ar',
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email!,
        name: userData.name!,
        phone: userData.phone!,
        role: userData.role || 'user',
        rewardPoints: 0,
        createdAt: new Date().toISOString(),
        language: (userData.language as 'en' | 'de' | 'ar') || 'ar',
        photo: userData.photo,
        isApproved: userData.isApproved,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      // If provider, add a complete ServiceProvider object to localStorage.providers
      if (newUser.role === 'provider') {
        let providers: ServiceProvider[] = [];
        const stored = localStorage.getItem('providers');
        if (stored) {
          providers = JSON.parse(stored);
        } else {
          providers = mockProviders;
        }
        const newProvider: ServiceProvider = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          category: (userData as any).category || '',
          subcategory: (userData as any).subcategory || '',
          location: (userData as any).location || '',
          country: 'Unknown',
          experience: Number((userData as any).experience) || 0,
          rating: 0,
          reviewCount: 0,
          price: 0,
          priceUnit: '',
          waitTime: '',
          photo: userData.photo || '',
          badges: [],
          isVerified: false,
          isActive: true,
          bio: (userData as any).bio || '',
          credentials: [],
          languages: [userData.language as string || 'en'],
          serviceHours: '',
          website: '',
          isApproved: 'pending',
        };
        providers.push(newProvider);
        localStorage.setItem('providers', JSON.stringify(providers));
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateLanguage = (language: 'en' | 'de' | 'ar') => {
    if (!user) return;
    const updatedUser = { ...user, language };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updateUser = (partial: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateLanguage, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};