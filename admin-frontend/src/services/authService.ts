import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Debug logging for development
if ((import.meta as any).env?.MODE === 'development') {
  console.log('Auth Service - API Base URL:', API_BASE_URL);
}

export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  contactNumber: string;
  role: 'admin' | 'employee';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
  });

  constructor() {
    // Add token to all requests if available
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Debug logging in development
        if ((import.meta as any).env?.MODE === 'development') {
          console.log('Auth API Request:', {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            headers: config.headers,
          });
        }
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for better error handling
    this.api.interceptors.response.use(
      (response) => {
        // Debug logging in development
        if ((import.meta as any).env?.MODE === 'development') {
          console.log('Auth API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }
        return response;
      },
      (error) => {
        console.error('Auth API Error:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Use employee login endpoint for admin users
      const response = await this.api.post('/auth/employee/login', credentials);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Only allow admin and employee users
        if (user.role !== 'admin' && user.role !== 'employee') {
          throw new Error('Access denied. Administrative privileges required.');
        }
        
        this.setAuthData(accessToken, refreshToken, user);
        return response.data;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Auth service is currently unavailable. Please check if the backend server is running.');
      }
      
      if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || 'Login failed';
        throw new Error(message);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Auth service is currently unavailable. Please try again later.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred during login.');
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get('/auth/profile');
      return response.data.data.user;
    } catch (error: any) {
      console.error('Get current user error:', error);
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Auth service is currently unavailable.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error('Failed to get user information.');
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      await this.api.get('/auth/verify');
      return true;
    } catch (error: any) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    try {
      if (refreshToken) {
        await this.api.post('/auth/logout', { refreshToken });
      }
    } finally {
      this.clearAuthData();
    }
  }

  getToken(): string | null {
    return localStorage.getItem('admin_access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('admin_refresh_token');
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private setAuthData(accessToken: string, refreshToken: string, user: User): void {
    localStorage.setItem('admin_access_token', accessToken);
    localStorage.setItem('admin_refresh_token', refreshToken);
    localStorage.setItem('admin_user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();