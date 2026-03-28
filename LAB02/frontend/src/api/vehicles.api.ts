import api from './axios';
import { Vehicle } from '../types';

export const vehiclesApi = {
  getAvailable: () => api.get<Vehicle[]>('/vehicles'),

  getAll: () => api.get<Vehicle[]>('/vehicles?all=true'),

  getById: (id: string) => api.get<Vehicle>(`/vehicles/${id}`),

  create: (data: Omit<Vehicle, 'id' | 'available' | 'createdAt'>) =>
    api.post<Vehicle>('/vehicles', data),

  update: (id: string, data: Omit<Vehicle, 'id' | 'available' | 'createdAt'>) =>
    api.put<Vehicle>(`/vehicles/${id}`, data),

  delete: (id: string) => api.delete(`/vehicles/${id}`),
};
