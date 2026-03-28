import api from './axios';
import { ClientProfile, AgentProfile } from '../types';

export const profileApi = {
  getClientProfile: () => api.get<ClientProfile>('/clients/me'),

  updateClientProfile: (data: {
    name?: string;
    address?: ClientProfile['address'];
    profession?: string;
    employers?: ClientProfile['employers'];
  }) => api.put<ClientProfile>('/clients/me', data),

  getAgentProfile: () => api.get<AgentProfile>('/agents/me'),

  updateAgentProfile: (data: {
    companyName?: string;
    address?: AgentProfile['address'];
    phone?: string;
  }) => api.put<AgentProfile>('/agents/me', data),
};
