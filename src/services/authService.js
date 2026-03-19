import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/accounts/register/', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/accounts/login/', credentials);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    await api.post('/accounts/logout/');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/accounts/profile/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.patch('/accounts/profile/', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/accounts/change-password/', passwordData);
    return response.data;
  },

  // Get current user details
  getUserDetails: async () => {
    const response = await api.get('/accounts/me/');
    return response.data;
  },
};
