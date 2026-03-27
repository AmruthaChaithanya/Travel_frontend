import api from './api';

export const ticketService = {
  // Flight Schedules (NEW - using schedules endpoint)
  getFlights: async (params) => {
    const response = await api.get('/schedules/flights/', { 
      params: {
        departure_airport: params.source || '',
        arrival_airport: params.destination || '',
        journey_date: params.journey_date || '',
      }
    });
    return response.data;
  },

  // Get flight details
  getFlight: async (id) => {
    const response = await api.get(`/schedules/flights/${id}/`);
    return response.data;
  },

  // Train Schedules (NEW - using schedules endpoint)
  getTrains: async (params) => {
    const response = await api.get('/schedules/trains/', { 
      params: {
        source_station: params.source || '',
        destination_station: params.destination || '',
        journey_date: params.journey_date || '',
      }
    });
    return response.data;
  },

  // Get train details
  getTrain: async (id) => {
    const response = await api.get(`/schedules/trains/${id}/`);
    return response.data;
  },

  // Bus Schedules (NEW - using schedules endpoint)
  getBuses: async (params) => {
    const response = await api.get('/schedules/buses/', { 
      params: {
        boarding_point: params.source || '',
        dropping_point: params.destination || '',
        journey_date: params.journey_date || '',
      }
    });
    return response.data;
  },

  // Get bus details
  getBus: async (id) => {
    const response = await api.get(`/schedules/buses/${id}/`);
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

  // Check seat availability for a schedule
  checkAvailability: async (scheduleType, scheduleId) => {
    const response = await api.get(`/schedules/${scheduleType}/${scheduleId}/availability/`);
    return response.data;
  },
};
