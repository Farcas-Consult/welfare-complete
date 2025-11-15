import api from './api';

export const reportsService = {
  getSummary: (params?: any) => api.get('/reports/summary', { params }),
  getContributionsReport: (params?: any) => api.get('/reports/contributions', { params }),
};

