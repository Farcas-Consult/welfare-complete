import api from './api';

export interface CreateLoanDto {
  memberId: string;
  amount: number;
  purpose?: string;
  repaymentPeriod?: number;
  interestRate?: number;
}

export const loansService = {
  getAll: (params?: any) => api.get('/loans', { params }),
  getById: (id: string) => api.get(`/loans/${id}`),
  create: (data: CreateLoanDto) => api.post('/loans', data),
  approve: (id: string) => api.put(`/loans/${id}/approve`),
};

