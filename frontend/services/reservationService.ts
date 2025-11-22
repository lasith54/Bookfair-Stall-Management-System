const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface CreateReservationRequest {
  stallId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  specialRequests?: string;
}

export interface Reservation {
  _id: string;
  reservationNumber: string;
  userId: string;
  stallId: string;
  startDate: string;
  endDate: string;
  duration: number;
  basePrice: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  purpose: string;
  specialRequests?: string;
  createdAt: string;
  stall?: {
    stallNumber: string;
    name: string;
    location?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

export interface CheckAvailabilityRequest {
  stallId: string;
  startDate: string;
  endDate: string;
}

class ReservationService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createReservation(data: CreateReservationRequest): Promise<{ success: boolean; data: Reservation }> {
    const response = await fetch(`${API_BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create reservation');
    }
    
    return response.json();
  }

  async getMyReservations(): Promise<{ success: boolean; data: { reservations: Reservation[] } }> {
    const response = await fetch(`${API_BASE_URL}/api/reservations/my-reservations`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch reservations');
    }
    
    return response.json();
  }

  async checkAvailability(data: CheckAvailabilityRequest): Promise<{ success: boolean; data: { isAvailable: boolean } }> {
    const response = await fetch(`${API_BASE_URL}/api/reservations/check-availability`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }
    
    return response.json();
  }

  async cancelReservation(id: string, reason: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/cancel`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel reservation');
    }
    
    return response.json();
  }
}

export const reservationService = new ReservationService();