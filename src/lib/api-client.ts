import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Create axios instance with default config
export const apiClient = axios.create({
  // Using relative URL for local development
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth token here
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with mock data for development
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // If there's no response, return mock data for development
    if (!error.response) {
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
    }

    // Handle actual API errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error('Unauthorized access. Please login again.');
          break;
        case 403:
          toast.error('Access forbidden.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error('An error occurred. Please try again.');
      }
    } else if (error.request) {
      toast.error('No response received from server.');
    } else {
      toast.error('Error setting up request.');
    }
    return Promise.reject(error);
  }
);

export { apiClient };