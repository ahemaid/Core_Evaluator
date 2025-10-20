// Environment configuration utility
export const env = {
  // Application
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ServicePro',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // File Upload Endpoints
  UPLOAD_PROVIDER_PHOTO_URL: import.meta.env.VITE_UPLOAD_PROVIDER_PHOTO_URL || 'http://localhost:3001/upload-provider-photo',
  UPLOAD_RECEIPT_URL: import.meta.env.VITE_UPLOAD_RECEIPT_URL || 'http://localhost:3001/upload-receipt',
  
  // File Storage Configuration
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB
  ALLOWED_FILE_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(','),
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  
  // Development Settings
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
  SHOW_CONSOLE_LOGS: import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true',
  
  // Internationalization
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  SUPPORTED_LANGUAGES: (import.meta.env.VITE_SUPPORTED_LANGUAGES || 'en,ar,de').split(','),
  
  // Theme Configuration
  DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME || 'light',
  AVAILABLE_THEMES: (import.meta.env.VITE_AVAILABLE_THEMES || 'light,dark').split(','),
  
  // External Services (Optional)
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  // Monitoring & Analytics (Optional)
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  
  // Security
  FORCE_HTTPS: import.meta.env.VITE_FORCE_HTTPS === 'true',
  
  // Firebase Configuration (Optional)
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || '',
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || '',
} as const;

// Helper functions
export const isDevelopment = () => env.APP_ENV === 'development';
export const isProduction = () => env.APP_ENV === 'production';

// File validation helpers
export const validateFileType = (file: File): boolean => {
  return env.ALLOWED_FILE_TYPES.includes(file.type);
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= env.MAX_FILE_SIZE;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debug logging
export const debugLog = (...args: any[]) => {
  if (env.SHOW_CONSOLE_LOGS) {
    console.log('[ServicePro Debug]', ...args);
  }
};

