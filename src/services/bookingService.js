import api from './api';

export const bookingService = {
  // Get all bookings for user
  getBookings: async () => {
    const response = await api.get('/bookings/');
    return response.data;
  },

  // Get booking details
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/create/', bookingData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.post(`/bookings/${id}/cancel/`);
    return response.data;
  },
};
