import api from './axios';
import { AuthResponse, RegisterClientForm, RegisterAgentForm } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  registerClient: (data: RegisterClientForm) =>
    api.post<AuthResponse>('/auth/register/client', data),

  registerAgent: (data: RegisterAgentForm) =>
    api.post<AuthResponse>('/auth/register/agent', data),
};
