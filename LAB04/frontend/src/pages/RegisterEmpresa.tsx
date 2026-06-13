import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Building2, ArrowLeft, UserPlus } from 'lucide-react'
import api, { extractError } from '../api/client'

export default function RegisterEmpresa() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', cnpj: '', login: '', senha: '' })

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/empresas', form)
      toast.success('Empresa cadastrada! Faça login para continuar.')
      navigate('/login')
    } catch (err) {
      toast.error(extractError(err, 'Não foi possível concluir o cadastro.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-xl px-4 animate-fade-in">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700">
          <ArrowLeft size={16} /> Voltar ao login
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cadastro de Empresa Parceira</h1>
            <p className="text-sm text-slate-500">Ofereça vantagens aos alunos do sistema</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 p-7">
          <div>
            <label className="label">Nome da empresa</label>
            <input className="input" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">CNPJ</label>
              <input className="input" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} required />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="mb-4 text-sm font-semibold text-slate-700">Dados de acesso</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label">Login</label>
                <input className="input" value={form.login} onChange={(e) => set('login', e.target.value)} required />
              </div>
              <div>
                <label className="label">Senha</label>
                <input type="password" className="input" value={form.senha} onChange={(e) => set('senha', e.target.value)} required minLength={4} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            <UserPlus size={18} />
            {loading ? 'Cadastrando...' : 'Criar conta de empresa'}
          </button>
        </form>
      </div>
    </div>
  )
}
