// import { parseCookies } from 'nookies';
// lib/axios.ts
import { jwtService } from '@/services/jwt.services';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define types for our API responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL ;
const TIMEOUT = 10000; // 10 seconds

// Create a custom axios instance
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...config,
  });

  // Add request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {

      const token = jwtService.getToken();
  
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Transform successful responses if needed
      return response;
    },
    (error: AxiosError) => {
      const { response } = error;
      
      // Handle errors based on status codes
      if (response) {
        const status = response.status;
        
        switch (status) {
          case 401: // Unauthorized
            // Handle token expiration or invalid authentication
            if (typeof window !== 'undefined') {
              // Only redirect on client side
              window.dispatchEvent(new CustomEvent('auth:logout', {
                detail: { reason: 'session_expired' }
              }));
              
              // Optional: Redirect to login
              // window.location.href = '/login';
            }
            break;
            
          case 403: // Forbidden
            // Handle permission issues
            console.error('Permission denied');
            break;
            
          case 500: // Server error
            console.error('Server error occurred');
            break;
            
          default:
            break;
        }
      } else if (error.request) {
        // Network error or no response received
        console.error('Network error, no response received');
      } else {
        // Request setup error
        console.error('Error setting up request:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Create default instance
const axiosClient = createAxiosInstance();

// Export a method to create instances with custom configs (useful for SSR)
export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  return createAxiosInstance(config);
};

export default axiosClient;