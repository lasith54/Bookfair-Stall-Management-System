import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export interface Reservation {
  _id: string;
  reservationNumber: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    contactNumber?: string;
  };
  stallId: string | {
    _id: string;
    stallNumber: string;
  };
  startDate: string;
  endDate: string;
  duration: number;
  basePrice: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  purpose?: string;
  specialRequests?: string;
  createdAt: string;
}

class ReservationService {
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

  async getAllReservations(): Promise<{ success: boolean; data: { reservations: Reservation[] } }> {
    const response = await this.api.get('/reservations/admin/all?limit=1000');
    return response.data;
  }

  async getReservationsByStallId(stallId: string): Promise<Reservation[]> {
    const response = await this.getAllReservations();
    if (response.success) {
      return response.data.reservations.filter((r: Reservation) => {
        const resStallId = typeof r.stallId === 'string' ? r.stallId : r.stallId._id;
        return resStallId === stallId && (r.status === 'confirmed' || r.status === 'completed');
      });
    }
    return [];
  }
}

export const reservationService = new ReservationService();
