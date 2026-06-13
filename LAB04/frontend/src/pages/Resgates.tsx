import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Ticket, Coins, Clock, CheckCircle2 } from 'lucide-react'
import api, { extractError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Spinner, EmptyState } from '../components/ui/Feedback'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Resgates() {
  const { user } = useAuth()
  const [resgates, setResgates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const path = user.tipo === 'EMPRESA'
          ? `/resgates/empresa/${user.id}`
          : `/resgates/aluno/${user.id}`
        const { data } = await api.get(path)
        setResgates(data)
      } catch (err) {
        toast.error(extractError(err))
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isEmpresa = user.tipo === 'EMPRESA'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-600 text-white">
          <Ticket size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {isEmpresa ? 'Resgates Recebidos' : 'Meus Resgates'}
          </h1>
          <p className="text-sm text-slate-500">
            {isEmpresa ? 'Cupons a conferir na troca presencial' : 'Seus cupons de vantagens resgatadas'}
          </p>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : resgates.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="Nenhum resgate ainda"
          message={isEmpresa ? 'Quando um aluno resgatar uma vantagem, aparecerá aqui.' : 'Resgate vantagens para gerar cupons.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {resgates.map((r) => (
            <div key={r.id} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 bg-slate-50 px-5 py-3">
                <span className="text-sm font-semibold text-slate-700">{r.vantagemNome}</span>
                <span className={`badge ${r.status === 'UTILIZADO' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>
                  {r.status === 'UTILIZADO' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {r.status === 'UTILIZADO' ? 'Utilizado' : 'Pendente'}
                </span>
              </div>
              <div className="p-5">
                <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 py-4 text-center">
                  <p className="text-xs font-semibold uppercase text-brand-600">Código do cupom</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-widest text-brand-700">{r.codigo}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {isEmpresa ? `Aluno: ${r.alunoNome}` : formatDate(r.data)}
                  </span>
                  <span className="badge bg-amber-50 text-amber-700"><Coins size={12} /> {r.custoMoedas}</span>
                </div>
                {isEmpresa && <p className="mt-1 text-xs text-slate-400">{formatDate(r.data)}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
