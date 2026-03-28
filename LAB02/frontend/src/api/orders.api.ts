import api from './axios';
import { RentalOrder } from '../types';

export const ordersApi = {
  create: (data: { vehicleId: string; startDate: string; endDate: string }) =>
    api.post<RentalOrder>('/rental-orders', data),

  getMyOrders: () => api.get<RentalOrder[]>('/rental-orders/my'),

  getById: (id: string) => api.get<RentalOrder>(`/rental-orders/${id}`),

  update: (id: string, data: { vehicleId?: string; startDate?: string; endDate?: string }) =>
    api.put<RentalOrder>(`/rental-orders/${id}`, data),

  cancel: (id: string) => api.patch<RentalOrder>(`/rental-orders/${id}/cancel`),

  getPending: () => api.get<RentalOrder[]>('/rental-orders/pending'),

  getAll: () => api.get<RentalOrder[]>('/rental-orders/all'),

  analyze: (id: string, data: { approved: boolean; notes?: string }) =>
    api.patch<RentalOrder>(`/rental-orders/${id}/analyze`, data),

  approve: (id: string) => api.patch<RentalOrder>(`/rental-orders/${id}/approve`),

  reject: (id: string) => api.patch<RentalOrder>(`/rental-orders/${id}/reject`),
};
