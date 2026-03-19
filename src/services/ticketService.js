import api from './api';

export const ticketService = {
  // Get all flights
  getFlights: async (params) => {
    const response = await api.get('/tickets/flights/', { params });
    return response.data;
  },

  // Get flight details
  getFlight: async (id) => {
    const response = await api.get(`/tickets/flights/${id}/`);
    return response.data;
  },

  // Get all trains
  getTrains: async (params) => {
    const response = await api.get('/tickets/trains/', { params });
    return response.data;
  },

  // Get train details
  getTrain: async (id) => {
    const response = await api.get(`/tickets/trains/${id}/`);
    return response.data;
  },

  // Get all buses
  getBuses: async (params) => {
    const response = await api.get('/tickets/buses/', { params });
    return response.data;
  },

  // Get bus details
  getBus: async (id) => {
    const response = await api.get(`/tickets/buses/${id}/`);
    return response.data;
  },

  // Search trains by stations
  searchTrains: async (from, to, date) => {
    const response = await api.get('/trains/search/', {
      params: { from, to, date }
    });
    return response.data;
  },

  // Check PNR status
  checkPNRStatus: async (pnr) => {
    const response = await api.get(`/trains/pnr/${pnr}/`);
    return response.data;
  },
};
