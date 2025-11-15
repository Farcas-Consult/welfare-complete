import api from './api';

export const auditService = {
  getLogs: (params?: any) => api.get('/audit/logs', { params }),
};

