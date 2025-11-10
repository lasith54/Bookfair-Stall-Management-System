import api from '../src/lib/api';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  businessName?: string;
  contactNumber: string;
  address?: string;
  role: 'vendor' | 'publisher';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      businessName?: string;
      contactNumber: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  contactNumber: string;
  address?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    
    if (response.data.success) {
      this.setAuthData(response.data.data);
    }
    
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    
    if (response.data.success) {
      this.setAuthData(response.data.data);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } finally {
      this.clearAuthData();
    }
  }

  async getProfile(): Promise<UserProfile> {
    const response = await api.get<{ success: boolean; data: { user: UserProfile } }>(
      '/api/auth/profile'
    );
    return response.data.data.user;
  }

  async verifyToken(): Promise<boolean> {
    try {
      await api.get('/api/auth/verify');
      return true;
    } catch {
      return false;
    }
  }

  private setAuthData(data: AuthResponse['data']): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse['data']['user'] | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();