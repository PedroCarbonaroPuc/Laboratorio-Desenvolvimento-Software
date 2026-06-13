export type Role = 'STUDENT' | 'PROFESSOR' | 'PARTNER'

export interface AuthResponse {
  token: string
  role: Role
  userId: string
  displayName: string
  expiresAt: string
}

export interface Institution {
  id: string
  name: string
  campus: string
  city: string
}

export interface StudentProfile {
  id: string
  name: string
  email: string
  cpf: string
  rg: string
  address: string
  institutionId: string
  course: string
  balance: number
}

export interface ProfessorProfile {
  id: string
  name: string
  email: string
  cpf: string
  department: string
  institutionId: string
  balance: number
}

export interface PartnerProfile {
  id: string
  companyName: string
  contactName: string
  email: string
  cnpj: string
  address: string
}

export interface Benefit {
  id: string
  partnerId: string
  partnerName: string
  title: string
  description: string
  imageUrl: string
  costCoins: number
  active: boolean
}

export interface StatementItem {
  id: string
  type: 'SEMESTER_ALLOCATION' | 'PROFESSOR_TO_STUDENT' | 'REDEMPTION'
  amount: number
  description: string
  counterpart: string
  couponCode: string | null
  createdAt: string
}

export interface Statement {
  balance: number
  transactions: StatementItem[]
}

export interface DashboardSummary {
  role: Role
  displayName: string
  balance: number
  totalTransactions: number
  totalBenefits: number
}

export interface RedemptionResponse {
  couponCode: string
  benefitId: string
  benefitTitle: string
  partnerName: string
  costCoins: number
  currentBalance: number
  redeemedAt: string
}

export interface ApiErrorPayload {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
}
