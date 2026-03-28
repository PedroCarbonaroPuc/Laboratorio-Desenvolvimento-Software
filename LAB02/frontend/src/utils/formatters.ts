import { OrderStatus, ContractStatus } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

export function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCnpj(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  UNDER_ANALYSIS: 'Em Análise',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  CANCELLED: 'Cancelado',
  ACTIVE: 'Ativo',
  COMPLETED: 'Concluído',
};

const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  PENDING: 'Pendente',
  ACTIVE: 'Ativo',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export function getStatusLabel(status: OrderStatus): string {
  return STATUS_LABELS[status] || status;
}

export function getContractStatusLabel(status: ContractStatus): string {
  return CONTRACT_STATUS_LABELS[status] || status;
}

export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'UNDER_ANALYSIS':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'APPROVED':
    case 'ACTIVE':
      return 'bg-success/10 text-success border-success/20';
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-danger/10 text-danger border-danger/20';
    case 'COMPLETED':
      return 'bg-primary-100 text-primary-600 border-primary-200';
    default:
      return 'bg-primary-100 text-primary-600 border-primary-200';
  }
}
