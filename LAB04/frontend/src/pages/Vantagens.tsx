import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Gift, Coins, Search, Ticket, CheckCircle2, Mail } from 'lucide-react'
import api, { extractError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { Spinner, EmptyState } from '../components/ui/Feedback'

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="%23eef2ff"/><text x="50%25" y="50%25" font-size="20" fill="%236366f1" text-anchor="middle" dy=".3em" font-family="Arial">Sem imagem</text></svg>'

export default function Vantagens() {
  const { user, updateSaldo } = useAuth()
  const [vantagens, setVantagens] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [redeeming, setRedeeming] = useState(false)
  const [cupom, setCupom] = useState(null)
  const [emailCupom, setEmailCupom] = useState('')

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCupom.trim())

  async function load() {
    setLoading(true)
    try {
      const [v, me] = await Promise.all([
        api.get('/vantagens'),
        api.get(`/alunos/${user.id}`).catch(() => null),
      ])
      setVantagens(v.data)
      if (me?.data) {
        updateSaldo(me.data.saldo)
        setEmailCupom(me.data.email || '')
      }
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleResgatar() {
    if (!emailValido) {
      toast.error('Informe um e-mail valido para receber o cupom.')
      return
    }

    setRedeeming(true)
    try {
      const { data } = await api.post('/resgates', {
        vantagemId: selected.id,
        emailDestinoCupom: emailCupom.trim(),
      })
      setSelected(null)
      setCupom(data)
      toast.success('Vantagem resgatada com sucesso!')
      const me = await api.get(`/alunos/${user.id}`)
      updateSaldo(me.data.saldo)
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setRedeeming(false)
    }
  }

  const filtered = vantagens.filter((v) =>
    [v.nome, v.descricao, v.empresaNome].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <Gift size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Vantagens</h1>
            <p className="text-sm text-slate-500">Troque suas moedas por benefícios</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 font-semibold text-amber-700">
          <Coins size={18} /> {user?.saldo ?? 0} moedas
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-10"
          placeholder="Buscar vantagens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Gift} title="Nenhuma vantagem disponível" message="Novas vantagens aparecerão aqui em breve." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => {
            const canAfford = (user?.saldo ?? 0) >= v.custoMoedas
            return (
              <div key={v.id} className="card group overflow-hidden">
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={v.foto || FALLBACK_IMG}
                    alt={v.nome}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 badge bg-white/90 text-amber-700 shadow">
                    <Coins size={12} /> {v.custoMoedas}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">{v.empresaNome}</p>
                  <h3 className="mt-1 font-bold text-slate-900">{v.nome}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{v.descricao}</p>
                  <button
                    className="btn-primary mt-4 w-full disabled:from-slate-300 disabled:to-slate-300"
                    onClick={() => {
                      setSelected(v)
                      if (!emailCupom.trim()) {
                        setEmailCupom('')
                      }
                    }}
                    disabled={!canAfford}
                  >
                    <Ticket size={16} />
                    {canAfford ? 'Resgatar' : 'Saldo insuficiente'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Confirmar resgate */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Confirmar resgate" maxWidth="max-w-md">
        {selected && (
          <div className="space-y-5">
            <div className="flex gap-4">
              <img
                src={selected.foto || FALLBACK_IMG}
                alt={selected.nome}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-semibold uppercase text-brand-500">{selected.empresaNome}</p>
                <h4 className="font-bold text-slate-900">{selected.nome}</h4>
                <span className="badge mt-1 bg-amber-50 text-amber-700"><Coins size={12} /> {selected.custoMoedas} moedas</span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              Saldo após resgate: <strong>{(user?.saldo ?? 0) - selected.custoMoedas} moedas</strong>
            </div>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4">
              <label className="label mb-2 inline-flex items-center gap-2 text-cyan-900">
                <Mail size={16} /> E-mail para receber o codigo do cupom
              </label>
              <input
                type="email"
                className="input bg-white"
                placeholder="seu-email@dominio.com"
                value={emailCupom}
                onChange={(e) => setEmailCupom(e.target.value)}
                required
              />
              {!emailValido && emailCupom.trim().length > 0 && (
                <p className="mt-2 text-xs font-medium text-rose-600">
                  Informe um e-mail valido para continuar.
                </p>
              )}
              <p className="mt-2 text-xs text-slate-600">
                O codigo sera enviado para este e-mail apos confirmar o resgate.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setSelected(null)}>Cancelar</button>
              <button className="btn-primary" onClick={handleResgatar} disabled={redeeming || !emailValido}>
                {redeeming ? 'Resgatando...' : 'Confirmar resgate'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cupom gerado */}
      <Modal open={!!cupom} onClose={() => setCupom(null)} title="Cupom gerado!" maxWidth="max-w-md">
        {cupom && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-sm text-slate-500">Você resgatou</p>
            <h4 className="text-lg font-bold text-slate-900">{cupom.vantagemNome}</h4>
            <div className="my-5 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50 py-5">
              <p className="text-xs font-semibold uppercase text-emerald-700">Código do cupom</p>
              <p className="mt-1 text-3xl font-extrabold tracking-widest text-emerald-700">{cupom.codigo}</p>
            </div>
            <p className="text-sm text-slate-500">
              Um email com o cupom foi enviado para o endereço informado no resgate. Apresente o código no parceiro.
            </p>
            <button className="btn-primary mt-5 w-full" onClick={() => setCupom(null)}>Concluir</button>
          </div>
        )}
      </Modal>
    </div>
  )
}
