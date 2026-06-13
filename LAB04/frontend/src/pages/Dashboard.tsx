import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Coins, Send, Gift, Receipt, Tag, Ticket, Users, Building2, ArrowRight, Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div className="card overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}

function ActionCard({ to, icon: Icon, title, desc, gradient }) {
  return (
    <Link to={to} className="card group flex items-center gap-4 p-5 transition hover:shadow-soft">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="truncate text-sm text-slate-500">{desc}</p>
      </div>
      <ArrowRight size={18} className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500" />
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ alunos: 0, empresas: 0, vantagens: 0 })

  useEffect(() => {
    async function load() {
      try {
        const [alunos, empresas, vantagens] = await Promise.all([
          api.get('/alunos').catch(() => ({ data: [] })),
          api.get('/empresas').catch(() => ({ data: [] })),
          api.get('/vantagens').catch(() => ({ data: [] })),
        ])
        setStats({
          alunos: alunos.data.length,
          empresas: empresas.data.length,
          vantagens: vantagens.data.length,
        })
      } catch {
        /* noop */
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="hero-panel p-8">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-200/25 blur-2xl" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-orange-200/20 blur-2xl" />
        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles size={14} /> Bem-vindo(a)
          </div>
          <h1 className="text-3xl font-extrabold">Olá, {user?.nome?.split(' ')[0]} 👋</h1>
          <p className="mt-2 max-w-lg text-white/80">
            {user?.tipo === 'PROFESSOR' && 'Reconheça o mérito dos seus alunos enviando moedas.'}
            {user?.tipo === 'ALUNO' && 'Acompanhe seu saldo e troque moedas por vantagens incríveis.'}
            {user?.tipo === 'EMPRESA' && 'Cadastre vantagens e acompanhe os resgates dos alunos.'}
          </p>
          {user?.tipo !== 'EMPRESA' && typeof user?.saldo === 'number' && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-3 backdrop-blur">
              <Coins size={28} />
              <div>
                <p className="text-xs text-white/70">Seu saldo atual</p>
                <p className="text-2xl font-bold">{user.saldo} moedas</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Alunos cadastrados" value={stats.alunos} gradient="from-brand-600 to-cyan-600" />
        <StatCard icon={Building2} label="Empresas parceiras" value={stats.empresas} gradient="from-amber-500 to-orange-500" />
        <StatCard icon={Gift} label="Vantagens disponíveis" value={stats.vantagens} gradient="from-emerald-500 to-teal-600" />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Ações rápidas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {user?.tipo === 'PROFESSOR' && (
            <>
              <ActionCard to="/enviar-moedas" icon={Send} title="Enviar moedas" desc="Reconheça um aluno" gradient="from-brand-600 to-cyan-600" />
              <ActionCard to="/extrato" icon={Receipt} title="Meu extrato" desc="Veja seus envios e saldo" gradient="from-sky-500 to-blue-600" />
            </>
          )}
          {user?.tipo === 'ALUNO' && (
            <>
              <ActionCard to="/vantagens" icon={Gift} title="Ver vantagens" desc="Troque suas moedas" gradient="from-emerald-500 to-teal-600" />
              <ActionCard to="/extrato" icon={Receipt} title="Meu extrato" desc="Recebimentos e trocas" gradient="from-sky-500 to-blue-600" />
              <ActionCard to="/resgates" icon={Ticket} title="Meus resgates" desc="Cupons gerados" gradient="from-cyan-600 to-sky-600" />
            </>
          )}
          {user?.tipo === 'EMPRESA' && (
            <>
              <ActionCard to="/minhas-vantagens" icon={Tag} title="Minhas vantagens" desc="Cadastre e gerencie" gradient="from-amber-500 to-orange-500" />
              <ActionCard to="/resgates" icon={Ticket} title="Resgates recebidos" desc="Confira os cupons" gradient="from-cyan-600 to-sky-600" />
            </>
          )}
          {user?.tipo === 'PROFESSOR' && (
            <ActionCard to="/alunos" icon={Users} title="Gerenciar alunos" desc="CRUD de alunos" gradient="from-indigo-500 to-purple-600" />
          )}
          {user?.tipo === 'EMPRESA' && (
            <ActionCard to="/empresas" icon={Building2} title="Gerenciar empresas" desc="CRUD de empresas" gradient="from-rose-500 to-red-600" />
          )}
        </div>
      </div>
    </div>
  )
}
