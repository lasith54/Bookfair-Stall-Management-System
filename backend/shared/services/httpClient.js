const axios = require('axios');

class ServiceClient {
  constructor(baseURL, serviceName = 'Unknown Service') {
    this.baseURL = baseURL;
    this.serviceName = serviceName;
    this.client = axios.create({
      baseURL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[${this.serviceName}] Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error(`[${this.serviceName}] Request Error:`, error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[${this.serviceName}] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          console.error(`[${this.serviceName}] Response Error: ${error.response.status} - ${error.response.data?.message || error.message}`);
        } else if (error.request) {
          console.error(`[${this.serviceName}] No Response - Service may be unavailable`);
        } else {
          console.error(`[${this.serviceName}] Error:`, error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authorization token for requests
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} config - Axios config
   * @returns {Promise} Response data
   */
  async get(endpoint, config = {}) {
    try {
      const response = await this.client.get(endpoint, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'GET', endpoint);
    }
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {object} config - Axios config
   * @returns {Promise} Response data
   */
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await this.client.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'POST', endpoint);
    }
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {object} config - Axios config
   * @returns {Promise} Response data
   */
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await this.client.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'PUT', endpoint);
    }
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} config - Axios config
   * @returns {Promise} Response data
   */
  async delete(endpoint, config = {}) {
    try {
      const response = await this.client.delete(endpoint, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'DELETE', endpoint);
    }
  }

  /**
   * Health check
   * @returns {Promise<boolean>} Service health status
   */
  async healthCheck() {
    try {
      await this.client.get('/health');
      console.log(`[${this.serviceName}] Health check: OK`);
      return true;
    } catch (error) {
      console.error(`[${this.serviceName}] Health check: FAILED`);
      return false;
    }
  }

  /**
   * Handle errors consistently
   * @param {Error} error - Error object
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   */
  handleError(error, method, endpoint) {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Service request failed';
      throw new Error(`${this.serviceName} error: ${errorMessage}`);
    } else if (error.request) {
      // No response received
      throw new Error(`${this.serviceName} is unavailable or not responding`);
    } else {
      // Request setup error
      throw new Error(`Error making request to ${this.serviceName}: ${error.message}`);
    }
  }
}

module.exports = ServiceClient;
