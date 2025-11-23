import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
    this.api.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
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
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/auth/profile');
    return response.data.data.user;
  }

  async verifyToken(): Promise<boolean> {
    try {
      await this.api.get('/auth/verify');
      return true;
    } catch {
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