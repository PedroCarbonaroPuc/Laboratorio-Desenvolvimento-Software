import api from './axios';
import { CreditContract } from '../types';

export const contractsApi = {
  create: (data: {
    rentalOrderId: string;
    bankAgentId: string;
    amount: number;
    interestRate: number;
    installments: number;
  }) => api.post<CreditContract>('/credit-contracts', data),

  getById: (id: string) => api.get<CreditContract>(`/credit-contracts/${id}`),

  getByOrderId: (orderId: string) =>
    api.get<CreditContract>(`/credit-contracts/order/${orderId}`),
};
