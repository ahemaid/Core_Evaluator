export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'provider' | 'admin' | 'evaluator';
  rewardPoints: number;
  createdAt: string;
  language: 'en' | 'de' | 'ar';
  photo?: string;
  isApproved?: true | false | 'pending' | 'rejected';
}

export interface ServiceProvider {
  id: string;
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
  bio: string;
  credentials: string[];
  languages: string[];
  serviceHours: string;
  website?: string;
  isApproved?: true | false | 'pending' | 'rejected';
}

export interface Appointment {
  id: string;
  userId: string;
  providerId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  hasReview: boolean;
  hasReceipt: boolean;
  serviceType: string;
}

export interface Review {
  id: string;
  userId: string;
  providerId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
}

export interface SearchFilters {
  category: string;
  subcategory: string;
  location: string;
  country: string;
  priceRange: [number, number];
  rating: number;
  sortBy: 'rating' | 'price' | 'waitTime';
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export interface Translation {
  [key: string]: {
    en: string;
    de: string;
    ar: string;
  };
}