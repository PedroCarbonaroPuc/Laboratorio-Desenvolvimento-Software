export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Employer {
  name: string;
  phone: string;
  income: number;
}

export interface AuthResponse {
  token: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
  userId: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
}

export interface ClientProfile {
  id: string;
  email: string;
  name: string;
  rg: string;
  cpf: string;
  address: Address;
  profession: string;
  employers: Employer[];
  totalIncome: number;
  createdAt: string;
}

export interface AgentProfile {
  id: string;
  email: string;
  companyName: string;
  cnpj: string;
  address: Address;
  phone: string;
  createdAt: string;
}

export type OwnerType = 'CLIENT' | 'COMPANY' | 'BANK';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  year: number;
  brand: string;
  model: string;
  licensePlate: string;
  ownerType: OwnerType;
  ownerId?: string;
  dailyRate: number;
  available: boolean;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'UNDER_ANALYSIS'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'ACTIVE'
  | 'COMPLETED';

export interface FinancialAnalysis {
  agentId: string;
  approved: boolean;
  notes?: string;
  analyzedAt: string;
}

export interface RentalOrder {
  id: string;
  clientId: string;
  clientName: string;
  vehicleId: string;
  vehicleDescription: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  totalAmount: number;
  status: OrderStatus;
  financialAnalysis?: FinancialAnalysis;
  creditContractId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContractStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface CreditContract {
  id: string;
  rentalOrderId: string;
  bankAgentId: string;
  clientId: string;
  amount: number;
  interestRate: number;
  installments: number;
  installmentAmount: number;
  status: ContractStatus;
  createdAt: string;
}

export interface RegisterClientForm {
  name: string;
  email: string;
  password: string;
  cpf: string;
  rg: string;
  address: Address;
  profession: string;
  employers: Employer[];
}

export interface RegisterAgentForm {
  companyName: string;
  email: string;
  password: string;
  cnpj: string;
  address: Address;
  phone: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'AGENT';
  createdAt: string;
}

export interface AdminDashboard {
  totalClients: number;
  totalAgents: number;
  totalVehicles: number;
  totalOrders: number;
  activeOrders: number;
  users: UserSummary[];
}

export interface AdminClientDetail {
  client: ClientProfile;
  orders: RentalOrder[];
}

export interface AdminAgentDetail {
  agent: AgentProfile;
  vehicles: Vehicle[];
  orders: RentalOrder[];
}
