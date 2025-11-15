import api from './api';

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  nationalId?: string;
  phonePrimary: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'deceased';
  planId?: string;
  kycStatus?: boolean;
}

export interface UpdateMemberDto extends Partial<CreateMemberDto> {}

export interface CreateDependentDto {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth?: string;
  nationalId?: string;
  phone?: string;
  isBeneficiary?: boolean;
  benefitPercentage?: number;
}

export const membersService = {
  getAll: (params?: any) => api.get('/members', { params }),
  getById: (id: string) => api.get(`/members/${id}`),
  create: (data: CreateMemberDto) => api.post('/members', data),
  update: (id: string, data: UpdateMemberDto) => api.put(`/members/${id}`, data),
  delete: (id: string) => api.delete(`/members/${id}`),
  addDependent: (id: string, data: CreateDependentDto) => api.post(`/members/${id}/dependents`, data),
  getDependents: (id: string) => api.get(`/members/${id}/dependents`),
};

