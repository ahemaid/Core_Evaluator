// API Communication Test Utility
import { env } from './env';

export const testApiConnection = async (): Promise<{
  success: boolean;
  message: string;
  backendUrl: string;
}> => {
  const backendUrl = env.API_BASE_URL.replace('/api', '');
  
  try {
    console.log('Testing API connection to:', backendUrl);
    
    // Test basic connectivity
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Backend connection successful',
        backendUrl,
      };
    } else {
      return {
        success: false,
        message: `Backend responded with status: ${response.status}`,
        backendUrl,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      backendUrl,
    };
  }
};

export const testAuthEndpoint = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${env.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: 'Auth endpoint working',
      };
    } else {
      return {
        success: false,
        message: `Auth endpoint error: ${data.message || response.statusText}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Auth endpoint failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Debug function to log current configuration
export const logApiConfiguration = () => {
  console.log('🔧 API Configuration:');
  console.log('  API_BASE_URL:', env.API_BASE_URL);
  console.log('  UPLOAD_PROVIDER_PHOTO_URL:', env.UPLOAD_PROVIDER_PHOTO_URL);
  console.log('  UPLOAD_RECEIPT_URL:', env.UPLOAD_RECEIPT_URL);
  console.log('  APP_ENV:', env.APP_ENV);
  console.log('  DEBUG_MODE:', env.ENABLE_DEBUG_MODE);
};
