import api from './api';

export interface CreateMeetingDto {
  title: string;
  date: string;
  time?: string;
  location?: string;
  type?: string;
  agenda?: string;
  attendeeIds?: string[];
}

export interface UpdateMeetingDto extends Partial<CreateMeetingDto> {}

export const meetingsService = {
  getAll: (params?: any) => api.get('/meetings', { params }),
  getById: (id: string) => api.get(`/meetings/${id}`),
  create: (data: CreateMeetingDto) => api.post('/meetings', data),
  update: (id: string, data: UpdateMeetingDto) => api.put(`/meetings/${id}`, data),
};

