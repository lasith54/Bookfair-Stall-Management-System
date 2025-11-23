import axios from 'axios';

// Use the API Gateway base URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('admin_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('admin_access_token', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  contactNumber: string;
  address?: string;
  role: 'vendor' | 'publisher' | 'employee' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  businessName?: string;
  contactNumber: string;
  address?: string;
  role: 'vendor' | 'publisher' | 'employee' | 'admin';
  isVerified?: boolean;
}

export interface UpdateUserData {
  name?: string;
  businessName?: string;
  contactNumber?: string;
  address?: string;
  role?: 'vendor' | 'publisher' | 'employee' | 'admin';
  isVerified?: boolean;
  isActive?: boolean;
}

export interface UserStats {
  totalUsers: number;
  admins: number;
  employees: number;
  vendors: number;
  publishers: number;
  activeUsers: number;
  verifiedUsers: number;
}

class UserService {
  // Get all users (admin only)
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    isVerified?: boolean;
  }): Promise<{
    users: User[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const response = await api.get('/auth/admin/users', { params });
      return response.data.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  // Get user by ID (admin only)
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get(`/auth/admin/users/${userId}`);
      return response.data.data.user;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  // Create new user (admin only)
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await api.post('/auth/admin/users', userData);
      return response.data.data.user;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  // Update user (admin only)
  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await api.put(`/auth/admin/users/${userId}`, userData);
      return response.data.data.user;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/auth/admin/users/${userId}`);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Activate/Deactivate user (admin only)
  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    try {
      const response = await api.patch(`/auth/admin/users/${userId}/status`, {
        isActive,
      });
      return response.data.data.user;
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw error;
    }
  }

  // Verify/Unverify user (admin only)
  async toggleUserVerification(userId: string, isVerified: boolean): Promise<User> {
    try {
      const response = await api.patch(`/auth/admin/users/${userId}/verification`, {
        isVerified,
      });
      return response.data.data.user;
    } catch (error) {
      console.error('Toggle user verification error:', error);
      throw error;
    }
  }

  // Get user statistics (admin only)
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await api.get('/auth/admin/users/stats');
      return response.data.data.stats;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  // Reset user password (admin only)
  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    try {
      await api.patch(`/auth/admin/users/${userId}/password`, {
        newPassword,
      });
    } catch (error) {
      console.error('Reset user password error:', error);
      throw error;
    }
  }

  // Get user activity log (admin only)
  async getUserActivity(userId: string, params?: {
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
  }): Promise<any[]> {
    try {
      const response = await api.get(`/auth/admin/users/${userId}/activity`, { params });
      return response.data.data.activities;
    } catch (error) {
      console.error('Get user activity error:', error);
      throw error;
    }
  }

  // Bulk update users (admin only)
  async bulkUpdateUsers(userIds: string[], updateData: UpdateUserData): Promise<void> {
    try {
      await api.patch('/auth/admin/users/bulk', {
        userIds,
        updateData,
      });
    } catch (error) {
      console.error('Bulk update users error:', error);
      throw error;
    }
  }

  // Export users data (admin only)
  async exportUsers(format: 'csv' | 'excel' = 'csv', filters?: any): Promise<Blob> {
    try {
      const response = await api.get('/auth/admin/users/export', {
        params: { format, ...filters },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Export users error:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;