import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  admins: number;
  employees: number;
  vendors: number;
  publishers: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: string;
}

class UserService {
  private api = axios.create({
    baseURL: API_BASE_URL,
  });

  constructor() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('admin_access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async getAllUsers(params: any) {
    const response = await this.api.get('/auth/admin/users', { params });
    return response.data.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.api.get('/auth/admin/users', { params: { limit: 1000 } });
    const users = response.data.data.users;
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u: User) => u.isActive).length,
      admins: users.filter((u: User) => u.role === 'admin').length,
      employees: users.filter((u: User) => u.role === 'employee').length,
      vendors: users.filter((u: User) => u.role === 'vendor').length,
      publishers: users.filter((u: User) => u.role === 'publisher').length,
    };
  }

  async createUser(userData: CreateUserData) {
    const response = await this.api.post('/auth/admin/users', userData);
    return response.data;
  }

  async toggleUserStatus(userId: string, isActive: boolean) {
    const response = await this.api.patch(`/auth/admin/users/${userId}/status`, { isActive });
    return response.data;
  }

  async toggleUserVerification(userId: string, isVerified: boolean) {
    const response = await this.api.patch(`/auth/admin/users/${userId}/verify`, { isVerified });
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await this.api.delete(`/auth/admin/users/${userId}`);
    return response.data;
  }

  async exportUsers(format: string, filters: any) {
    const response = await this.api.get('/auth/admin/users/export', {
      params: { format, ...filters },
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new UserService();
