import api from './axios';
import { AdminDashboard, AdminClientDetail, AdminAgentDetail, AdminProfile } from '../types';

export const adminApi = {
  getDashboard: () => api.get<AdminDashboard>('/admin/dashboard'),

  getClientDetail: (id: string) => api.get<AdminClientDetail>(`/admin/clients/${id}`),

  getAgentDetail: (id: string) => api.get<AdminAgentDetail>(`/admin/agents/${id}`),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  getMyProfile: () => api.get<AdminProfile>('/admin/me'),

  updateMyProfile: (data: { name: string }) => api.put<AdminProfile>('/admin/me', data),
};
