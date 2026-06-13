import type {
  ApiErrorPayload,
  AuthResponse,
  Benefit,
  DashboardSummary,
  Institution,
  PartnerProfile,
  ProfessorProfile,
  RedemptionResponse,
  Role,
  Statement,
  StudentProfile,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  token?: string | null
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    let message = `Erro ${response.status}`

    try {
      const payload = (await response.json()) as ApiErrorPayload
      if (payload.message) {
        message = payload.message
      }
    } catch {
      message = response.statusText || message
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const api = {
  apiBaseUrl: API_BASE_URL,

  login: (login: string, password: string, role: Role) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { login, password, role },
    }),

  logout: (token: string | null) =>
    request<void>('/auth/logout', {
      method: 'POST',
      token,
    }),

  institutions: () => request<Institution[]>('/institutions'),

  listBenefits: () => request<Benefit[]>('/benefits'),

  registerStudent: (payload: {
    name: string
    email: string
    cpf: string
    rg: string
    address: string
    institutionId: string
    course: string
    password: string
  }) => request<StudentProfile>('/students/register', { method: 'POST', body: payload }),

  registerPartner: (payload: {
    companyName: string
    contactName: string
    email: string
    cnpj: string
    address: string
    password: string
  }) => request<PartnerProfile>('/partners/register', { method: 'POST', body: payload }),

  dashboardSummary: (token: string) => request<DashboardSummary>('/dashboard/summary', { token }),

  studentProfile: (token: string) => request<StudentProfile>('/students/me', { token }),

  updateStudent: (
    token: string,
    payload: {
      name?: string
      address?: string
      course?: string
      password?: string
    },
  ) =>
    request<StudentProfile>('/students/me', {
      method: 'PUT',
      token,
      body: payload,
    }),

  deleteStudent: (token: string) =>
    request<void>('/students/me', {
      method: 'DELETE',
      token,
    }),

  studentStatement: (token: string) => request<Statement>('/students/me/statement', { token }),

  professorProfile: (token: string) => request<ProfessorProfile>('/professors/me', { token }),

  professorStatement: (token: string) => request<Statement>('/professors/me/statement', { token }),

  listStudents: (token: string) => request<StudentProfile[]>('/students', { token }),

  transferCoins: (
    token: string,
    payload: {
      studentId: string
      amount: number
      message: string
    },
  ) =>
    request<void>('/professors/me/transfer', {
      method: 'POST',
      token,
      body: payload,
    }),

  partnerProfile: (token: string) => request<PartnerProfile>('/partners/me', { token }),

  updatePartner: (
    token: string,
    payload: {
      companyName?: string
      contactName?: string
      address?: string
      password?: string
    },
  ) =>
    request<PartnerProfile>('/partners/me', {
      method: 'PUT',
      token,
      body: payload,
    }),

  deletePartner: (token: string) =>
    request<void>('/partners/me', {
      method: 'DELETE',
      token,
    }),

  listOwnBenefits: (token: string) => request<Benefit[]>('/benefits/me', { token }),

  createBenefit: (
    token: string,
    payload: {
      title: string
      description: string
      imageUrl: string
      costCoins: number
    },
  ) =>
    request<Benefit>('/benefits', {
      method: 'POST',
      token,
      body: payload,
    }),

  updateBenefit: (
    token: string,
    benefitId: string,
    payload: {
      title?: string
      description?: string
      imageUrl?: string
      costCoins?: number
      active?: boolean
    },
  ) =>
    request<Benefit>(`/benefits/${benefitId}`, {
      method: 'PUT',
      token,
      body: payload,
    }),

  deleteBenefit: (token: string, benefitId: string) =>
    request<void>(`/benefits/${benefitId}`, {
      method: 'DELETE',
      token,
    }),

  redeemBenefit: (token: string, benefitId: string) =>
    request<RedemptionResponse>('/redemptions', {
      method: 'POST',
      token,
      body: { benefitId },
    }),
}
