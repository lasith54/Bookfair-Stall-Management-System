import axios from 'axios';
import userService from './userService';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

class DashboardService {
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

  async getStallStatistics() {
    const response = await this.api.get('/stalls/statistics');
    return response.data.data;
  }

  async getReservationStatistics() {
    const response = await this.api.get('/reservations/admin/all?limit=1000');
    return response.data.data;
  }

  async getUserStats() {
    return userService.getUserStats();
  }
}

export const dashboardService = new DashboardService();
