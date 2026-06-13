import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import type { LoginRequest, UserSession } from '../types'
import type { ReactNode } from 'react'

interface AuthContextValue {
  user: UserSession | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<UserSession>
  logout: () => void
  updateSaldo: (saldo: number) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored) as UserSession)
      } catch {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  async function login(credentials: LoginRequest) {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data as UserSession
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  function updateSaldo(saldo: number) {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, saldo }
      localStorage.setItem('user', JSON.stringify(next))
      return next
    })
  }

  const value = useMemo(
    () => ({ user, loading, login, logout, updateSaldo, isAuthenticated: !!user }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
