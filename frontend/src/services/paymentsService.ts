import api from './api';

export interface CreatePaymentDto {
  memberId?: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  paymentDate?: string;
  notes?: string;
}

export const paymentsService = {
  getAll: (params?: any) => api.get('/payments', { params }),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (data: CreatePaymentDto) => api.post('/payments', data),
};

