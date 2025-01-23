import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define public routes that don't need authentication
const publicRoutes = ['/register', '/login'];

// Function to set auth token
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Initialize token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip adding token for public routes
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    if (isPublicRoute) {
      // Remove any existing Authorization header for public routes
      delete config.headers.Authorization;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Mock login function for development
export const login = async (email: string, password: string) => {
  try {
    // In development, return mock data
    const mockResponse = {
      data: {
        token: 'mock_jwt_token',
        user: {
          id: '1',
          email: email,
          name: 'Test User'
        }
      }
    };

    // Set the token in localStorage and axios defaults
    setAuthToken(mockResponse.data.token);
    
    return mockResponse;
  } catch (error) {
    throw error;
  }
};

// Response interceptor with error handling and mock data for development
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle network errors or no response
    if (!error.response) {
      // Return mock data for development
      if (error.config?.url === '/subscriptions') {
        return Promise.resolve({
          data: [
            {
              id: '1',
              name: 'Netflix',
              price: 14.99,
              billingCycle: 'monthly',
              nextBillingDate: '2024-03-15',
              status: 'active',
              icon: '📺',
            },
            {
              id: '2',
              name: 'Spotify',
              price: 9.99,
              billingCycle: 'monthly',
              nextBillingDate: '2024-03-20',
              status: 'active',
              icon: '🎵',
            },
          ]
        });
      }
      if (error.config?.url === '/transactions') {
        return Promise.resolve({
          data: [
            {
              id: '1',
              subscriptionId: '1',
              amount: 14.99,
              date: '2024-02-15',
              status: 'completed',
            },
            {
              id: '2',
              subscriptionId: '2',
              amount: 9.99,
              date: '2024-02-20',
              status: 'completed',
            },
          ]
        });
      }

      toast.error('Network error. Please check your connection.');
      return Promise.reject(new Error('Network error'));
    }

    // Handle HTTP errors
    const status = error.response.status;
    const errorData = error.response.data as { message?: string };
    const errorMessage = errorData?.message || 'An error occurred';

    switch (status) {
      case 400:
        toast.error(`Bad Request: ${errorMessage}`);
        break;
      case 401:
        toast.error('Session expired. Please login again.');
        setAuthToken(''); // Clear token
        break;
      case 403:
        toast.error('Access forbidden. You don\'t have permission.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 422:
        toast.error(`Validation Error: ${errorMessage}`);
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(`Error: ${errorMessage}`);
    }

    // Log error for debugging
    console.error('API Error:', {
      status,
      url: error.config?.url,
      message: errorMessage,
      data: error.response.data
    });

    return Promise.reject(error);
  }
);