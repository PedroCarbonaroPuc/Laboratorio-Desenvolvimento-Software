export type TipoUsuario = 'ALUNO' | 'PROFESSOR' | 'EMPRESA'

export interface UserSession {
  id: string
  nome: string
  login: string
  tipo: TipoUsuario
  saldo?: number
  token: string
}

export interface LoginRequest {
  login: string
  senha: string
  tipo: TipoUsuario
}

export interface Instituicao {
  id: string
  nome: string
  cidade: string
}

export interface Aluno {
  id: string
  nome: string
  email: string
  cpf: string
  rg: string
  endereco: string
  curso: string
  instituicaoId: string
  instituicaoNome?: string
  saldo: number
  login?: string
}

export interface Professor {
  id: string
  nome: string
  cpf: string
  saldo: number
}

export interface Empresa {
  id: string
  nome: string
  email: string
  cnpj: string
  login?: string
}

export interface Vantagem {
  id: string
  nome: string
  descricao: string
  foto: string
  custoMoedas: number
  empresaId?: string
  empresaNome?: string
}

export type TipoTransacao = 'ENVIO' | 'RESGATE'

export interface Transacao {
  id: string
  tipo: TipoTransacao
  origemId: string
  origemNome: string
  destinoId: string
  destinoNome: string
  valor: number
  mensagem: string
  data: string
}

export interface Extrato {
  usuarioId: string
  nome: string
  saldo: number
  transacoes: Transacao[]
}

export type StatusResgate = 'PENDENTE' | 'UTILIZADO'

export interface Resgate {
  id: string
  codigo: string
  alunoId: string
  alunoNome: string
  vantagemId: string
  vantagemNome: string
  custoMoedas: number
  empresaId: string
  status: StatusResgate
  data: string
}

export interface EmailConfig {
  host: string
  port: number
  username: string
  hasPassword: boolean
  smtpAuth: boolean
  starttls: boolean
  fromEmail: string
  mode: 'ENV' | 'APP_CONFIG' | string
}

export interface EmailConfigUpdateRequest {
  host: string
  port: number
  username: string
  password?: string
  smtpAuth: boolean
  starttls: boolean
  fromEmail: string
}
