import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Receipt, Coins, ArrowDownLeft, ArrowUpRight, Gift } from 'lucide-react'
import api, { extractError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Spinner, EmptyState } from '../components/ui/Feedback'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Extrato() {
  const { user, updateSaldo } = useAuth()
  const [extrato, setExtrato] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const path = user.tipo === 'PROFESSOR'
          ? `/transacoes/extrato/professor/${user.id}`
          : `/transacoes/extrato/aluno/${user.id}`
        const { data } = await api.get(path)
        setExtrato(data)
        updateSaldo(data.saldo)
      } catch (err) {
        toast.error(extractError(err))
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Spinner />

  const transacoes = extrato?.transacoes || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
          <Receipt size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Meu Extrato</h1>
          <p className="text-sm text-slate-500">Histórico de transações da sua conta</p>
        </div>
      </div>

      {/* Saldo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-cyan-600 p-7 text-white shadow-soft">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">Saldo atual</p>
            <p className="mt-1 text-4xl font-extrabold">{extrato?.saldo ?? 0}</p>
            <p className="text-sm text-white/70">moedas estudantis</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Coins size={32} />
          </div>
        </div>
      </div>

      {/* Transações */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Transações</h2>
        {transacoes.length === 0 ? (
          <EmptyState icon={Receipt} title="Nenhuma transação ainda" message="Suas movimentações aparecerão aqui." />
        ) : (
          <div className="space-y-2.5">
            {transacoes.map((t) => {
              const isResgate = t.tipo === 'RESGATE'
              const isReceived = t.destinoId === user.id && !isResgate
              const Icon = isResgate ? Gift : isReceived ? ArrowDownLeft : ArrowUpRight
              const positive = isReceived
              return (
                <div key={t.id} className="card flex items-center gap-4 p-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    isResgate ? 'bg-fuchsia-50 text-fuchsia-600'
                      : isReceived ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">
                      {isResgate ? `Resgate · ${t.destinoNome}`
                        : isReceived ? `Recebido de ${t.origemNome}` : `Enviado para ${t.destinoNome}`}
                    </p>
                    <p className="truncate text-sm text-slate-500">{t.mensagem}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{formatDate(t.data)}</p>
                  </div>
                  <div className={`shrink-0 text-right font-bold ${positive ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {positive ? '+' : '−'}{t.valor}
                    <p className="text-xs font-normal text-slate-400">moedas</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
