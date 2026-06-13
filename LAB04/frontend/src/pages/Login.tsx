import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Coins, GraduationCap, Briefcase, BookOpen, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { extractError } from '../api/client'
import type { LoginRequest, TipoUsuario } from '../types'

const TIPOS = [
  { value: 'ALUNO', label: 'Aluno', icon: GraduationCap },
  { value: 'PROFESSOR', label: 'Professor', icon: BookOpen },
  { value: 'EMPRESA', label: 'Empresa', icon: Briefcase },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginRequest>({ login: '', senha: '', tipo: 'ALUNO' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Bem-vindo de volta!')
      navigate('/')
    } catch (err) {
      toast.error(extractError(err, 'Não foi possível autenticar.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Hero */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-950 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-700 to-cyan-700 opacity-95" />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Coins size={24} />
            </div>
            <span className="font-display text-lg font-bold">Moeda Estudantil</span>
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-tight">
              Reconhecimento que<br />vira recompensa.
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/80">
              Professores premiam o mérito dos alunos com moedas virtuais. Alunos trocam por
              vantagens reais em empresas parceiras.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-3xl font-bold">1.000</p>
                <p className="text-sm text-white/70">moedas/semestre</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-white/70">mérito reconhecido</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-white/60">PUC Minas · Laboratório de Desenvolvimento de Software</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex w-full items-center justify-center bg-zinc-50 p-6 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-600 lg:hidden">
              <Coins size={28} className="text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Acessar conta</h2>
            <p className="mt-1 text-sm text-slate-500">Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-5 p-7">
            <div>
              <label className="label">Tipo de usuário</label>
              <div className="grid grid-cols-3 gap-2">
                {TIPOS.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setForm({ ...form, tipo: t.value as TipoUsuario })}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                      form.tipo === t.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <t.icon size={20} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Login</label>
              <input
                className="input"
                placeholder="seu login"
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">
              <p className="font-semibold text-slate-600">Contas de demonstração</p>
              <p className="mt-1">aluno · professor · empresa — senha: <span className="font-mono">123456</span></p>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Ainda não tem conta?{' '}
            <Link to="/cadastro/aluno" className="font-semibold text-brand-600 hover:text-brand-700">
              Cadastrar aluno
            </Link>{' '}
            ou{' '}
            <Link to="/cadastro/empresa" className="font-semibold text-brand-600 hover:text-brand-700">
              empresa
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
