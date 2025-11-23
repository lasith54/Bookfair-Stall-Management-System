const ServiceClient = require('../../shared/services/httpClient');

/**
 * Stall Service Client
 * Handles all communication with the Stall Service
 */
class StallServiceClient {
  constructor() {
    const stallServiceUrl = process.env.STALL_SERVICE_URL || 'http://localhost:3002';
    this.client = new ServiceClient(stallServiceUrl, 'Stall Service');
  }

  /**
   * Get stall details by ID
   * @param {string} stallId - Stall ID
   * @returns {Promise<object>} Stall details
   */
  async getStallById(stallId) {
    try {
      const response = await this.client.get(`/api/stalls/${stallId}`);
      return response.data.stall;
    } catch (error) {
      console.error(`Error fetching stall ${stallId}:`, error.message);
      throw new Error('Unable to fetch stall details');
    }
  }

  /**
   * Check if stall is available for reservation
   * @param {string} stallId - Stall ID
   * @returns {Promise<boolean>} Availability status
   */
  async checkStallAvailability(stallId) {
    try {
      const stall = await this.getStallById(stallId);
      return stall.status === 'available';
    } catch (error) {
      console.error(`Error checking stall availability:`, error.message);
      throw error;
    }
  }

  /**
   * Get stall pricing information
   * @param {string} stallId - Stall ID
   * @returns {Promise<object>} Pricing details
   */
  async getStallPricing(stallId) {
    try {
      const stall = await this.getStallById(stallId);
      return {
        basePrice: stall.pricing.basePrice,
        currency: stall.pricing.currency || 'LKR'
      };
    } catch (error) {
      console.error(`Error fetching stall pricing:`, error.message);
      throw error;
    }
  }

  /**
   * Validate stall for reservation (combined check)
   * @param {string} stallId - Stall ID
   * @returns {Promise<object>} Stall details if valid
   * @throws {Error} If stall is not available
   */
  async validateStallForReservation(stallId) {
    try {
      const stall = await this.getStallById(stallId);

      if (stall.status !== 'available') {
        throw new Error('Stall is not available for reservation');
      }

      return stall;
    } catch (error) {
      console.error(`Error validating stall for reservation:`, error.message);
      throw error;
    }
  }

  /**
   * Get multiple stalls by IDs
   * @param {Array<string>} stallIds - Array of stall IDs
   * @returns {Promise<Array>} Array of stall details
   */
  async getMultipleStalls(stallIds) {
    try {
      const stallPromises = stallIds.map(id => this.getStallById(id).catch(() => null));
      const stalls = await Promise.all(stallPromises);
      return stalls.filter(stall => stall !== null);
    } catch (error) {
      console.error(`Error fetching multiple stalls:`, error.message);
      throw error;
    }
  }

  /**
   * Update stall status
   * @param {string} stallId - Stall ID
   * @param {string} status - New status (available, reserved, maintenance, inactive)
   * @returns {Promise<object>} Updated stall details
   */
  async updateStallStatus(stallId, status) {
    try {
      const response = await this.client.patch(`/api/internal/stalls/${stallId}/status`, { status });
      return response.data.stall;
    } catch (error) {
      console.error(`Error updating stall status:`, error.message);
      throw new Error('Unable to update stall status');
    }
  }
}

// Export singleton instance
module.exports = new StallServiceClient();
