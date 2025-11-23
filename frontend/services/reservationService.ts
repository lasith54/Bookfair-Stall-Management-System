const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

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
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createReservation(data: CreateReservationRequest): Promise<{ success: boolean; data: Reservation }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Handle empty response body for timeout or server errors
        let errorMessage = 'Failed to create reservation';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          // Response has no JSON body
          if (response.status === 408) {
            errorMessage = 'Request timed out. The server took too long to respond. Please try again.';
          } else if (response.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else {
            errorMessage = `Request failed with status ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Request timed out after 30 seconds. Please check if all services are running.');
      }
      throw err;
    }
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