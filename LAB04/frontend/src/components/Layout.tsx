import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  Send,
  Receipt,
  Gift,
  Tag,
  Ticket,
  LogOut,
  Menu,
  X,
  Coins,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { TipoUsuario } from '../types'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  roles: TipoUsuario[]
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ALUNO', 'PROFESSOR', 'EMPRESA'] },
  { to: '/enviar-moedas', label: 'Enviar Moedas', icon: Send, roles: ['PROFESSOR'] },
  { to: '/vantagens', label: 'Vantagens', icon: Gift, roles: ['ALUNO'] },
  { to: '/minhas-vantagens', label: 'Minhas Vantagens', icon: Tag, roles: ['EMPRESA'] },
  { to: '/extrato', label: 'Meu Extrato', icon: Receipt, roles: ['ALUNO', 'PROFESSOR'] },
  { to: '/resgates', label: 'Resgates', icon: Ticket, roles: ['ALUNO', 'EMPRESA'] },
  { to: '/alunos', label: 'Gerenciar Alunos', icon: Users, roles: ['PROFESSOR'] },
  { to: '/empresas', label: 'Gerenciar Empresas', icon: Building2, roles: ['EMPRESA'] },
]

const ROLE_LABEL: Record<TipoUsuario, string> = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  EMPRESA: 'Empresa Parceira',
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const items = NAV.filter((item) => item.roles.includes(user?.tipo))

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500">
            <Coins size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Moeda Estudantil</p>
            <p className="text-[11px] text-slate-400">PUC Minas</p>
          </div>
          <button className="ml-auto text-slate-400 lg:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-700 to-cyan-600 text-white shadow-soft'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-white/40 bg-white/70 px-4 backdrop-blur lg:px-8">
          <button className="text-slate-500 lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            {user?.tipo !== 'EMPRESA' && typeof user?.saldo === 'number' && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                <Coins size={16} />
                {user.saldo} moedas
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-cyan-600 text-sm font-bold text-white">
                {user?.nome?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.nome}</p>
                <p className="text-xs text-slate-500">{ROLE_LABEL[user?.tipo]}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="animate-fade-in p-4 lg:p-8">
          <div className="page-shell">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
