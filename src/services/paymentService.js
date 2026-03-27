import api from './api';

export const paymentService = {
  createOrder: async (payload) => {
    const response = await api.post('/payments/create-order/', payload);
    return response.data;
  },

  verifyPayment: async (payload) => {
    const response = await api.post('/payments/verify-payment/', payload);
    return response.data;
  },
};

