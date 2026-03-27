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

  // Create new booking from schedule (UPDATED - schedule-based flow)
  createBooking: async (bookingData) => {
    // bookingData should contain:
    // {
    //   schedule_type: 'FLIGHT' | 'TRAIN' | 'BUS',
    //   schedule_id: number,
    //   number_of_seats: number
    // }
    const response = await api.post('/bookings/create/', bookingData);
    return response.data;
  },

  // Confirm booking after payment (NEW - for completing booking)
  confirmBooking: async (bookingId, confirmData) => {
    const response = await api.post(`/bookings/${bookingId}/confirm/`, confirmData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await api.post(`/bookings/${bookingId}/cancel/`);
    return response.data;
  },

};
