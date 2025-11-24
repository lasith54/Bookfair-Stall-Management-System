import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Stall {
  _id: string;
  stallNumber: string;
  location: {
    zone: string;
    floor: string;
    section: string;
  };
  dimensions: {
    width: number;
    length: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
  };
  status: 'available' | 'reserved' | 'occupied' | 'maintenance';
  notes?: string;
}

class StallService {
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

  async getAllStalls(): Promise<{ success: boolean; data: { stalls: Stall[] } }> {
    const response = await this.api.get('/stalls?limit=200');
    return response.data;
  }

  async getStallById(id: string): Promise<{ success: boolean; data: { stall: Stall } }> {
    const response = await this.api.get(`/stalls/${id}`);
    return response.data;
  }
}

export const stallService = new StallService();
