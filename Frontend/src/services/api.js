import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const medicalService = {
  /**
   * Get current user details.
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error) {
      console.error('Fetch User Error:', error);
      throw error;
    }
  },
  /**
   * Get diagnosis and chat response from the agentic workflow.
   * @param {Object} data - { query, symptoms, severity, duration }
   */
  async processQuery(data) {
    try {
      const response = await api.post('/health/services', {
        query: data.query || '',
        symptoms: data.symptoms || [],
        severity: parseInt(data.severity) || 0,
        duration: data.duration || '',
        context: data.context || {
          location: "Unknown",
          age: 0,
          gender: "unknown"
        }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Login service
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  /**
   * Signup service
   */
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup Error:', error);
      throw error;
    }
  },

  /**
   * Logout service
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }
};

export default api;
