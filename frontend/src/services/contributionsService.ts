import api from './api';

export const contributionsService = {
  getInvoices: (params?: any) => api.get('/contributions/invoices', { params }),
  getInvoice: (id: string) => api.get(`/contributions/invoices/${id}`),
  getPlans: () => api.get('/contributions/plans'),
};

