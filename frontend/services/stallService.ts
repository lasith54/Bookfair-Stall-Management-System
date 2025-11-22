const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface Stall {
  _id: string;
  stallNumber: string;
  name: string;
  location: {
    zone: string;
    floor: string;
    section: string;
  };
  pricing: {
    basePrice: number;
    currency: string;
  };
  size: {
    width: number;
    height: number;
    area: number;
  };
  amenities: string[];
  features: string[];
  category: string;
  status: 'available' | 'reserved' | 'unavailable';
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

class StallService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getAllStalls(): Promise<{ success: boolean; data: Stall[] }> {
    const response = await fetch(`${API_BASE_URL}/api/stalls`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stalls');
    }
    
    return response.json();
  }

  async getStallById(id: string): Promise<{ success: boolean; data: Stall }> {
    const response = await fetch(`${API_BASE_URL}/api/stalls/${id}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stall');
    }
    
    return response.json();
  }

  async getAvailableStalls(): Promise<{ success: boolean; data: Stall[] }> {
    const response = await fetch(`${API_BASE_URL}/api/stalls?status=available`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch available stalls');
    }
    
    return response.json();
  }
}

export const stallService = new StallService();