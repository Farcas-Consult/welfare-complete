import api from './api';

export interface CreateClaimDto {
  memberId: string;
  claimType: string;
  amount: number;
  description?: string;
  supportingDocuments?: string[];
}

export interface ApproveClaimDto {
  approvedAmount?: number;
  notes?: string;
}

export const claimsService = {
  getAll: (params?: any) => api.get('/claims', { params }),
  getById: (id: string) => api.get(`/claims/${id}`),
  create: (data: CreateClaimDto) => api.post('/claims', data),
  approve: (id: string, data?: ApproveClaimDto) => api.put(`/claims/${id}/approve`, data),
};

