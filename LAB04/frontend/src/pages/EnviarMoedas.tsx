import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Send, Coins, Search, MessageSquare } from 'lucide-react'
import api, { extractError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Spinner, EmptyState } from '../components/ui/Feedback'

export default function EnviarMoedas() {
  const { user, updateSaldo } = useAuth()
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [quantidade, setQuantidade] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [sending, setSending] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/alunos')
      setAlunos(data)
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function refreshSaldo() {
    try {
      const { data } = await api.get(`/professores/${user.id}`)
      updateSaldo(data.saldo)
    } catch {
      /* noop */
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selected) {
      toast.error('Selecione um aluno destinatário.')
      return
    }
    const qtd = Number(quantidade)
    if (!qtd || qtd <= 0) {
      toast.error('Informe uma quantidade válida.')
      return
    }
    if (qtd > (user?.saldo ?? 0)) {
      toast.error('Saldo insuficiente para este envio.')
      return
    }
    setSending(true)
    try {
      await api.post('/transacoes/envio', {
        alunoId: selected.id,
        quantidade: qtd,
        mensagem,
      })
      toast.success(`${qtd} moedas enviadas para ${selected.nome}!`)
      setSelected(null)
      setQuantidade('')
      setMensagem('')
      await refreshSaldo()
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setSending(false)
    }
  }

  const filtered = alunos.filter((a) =>
    [a.nome, a.email, a.curso].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-600 text-white">
          <Send size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enviar Moedas</h1>
          <p className="text-sm text-slate-500">Reconheça o mérito de um aluno</p>
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 font-semibold text-amber-700">
          <Coins size={18} /> Saldo: {user?.saldo ?? 0} moedas
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Lista de alunos */}
        <div className="lg:col-span-3">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Buscar aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Search} title="Nenhum aluno encontrado" message="Ajuste sua busca." />
          ) : (
            <div className="space-y-2">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                    selected?.id === a.id
                      ? 'border-brand-500 bg-brand-50 shadow-soft'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-cyan-600 text-sm font-bold text-white">
                    {a.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{a.nome}</p>
                    <p className="truncate text-xs text-slate-500">{a.curso} · {a.email}</p>
                  </div>
                  <span className="badge bg-amber-50 text-amber-700"><Coins size={12} /> {a.saldo}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form de envio */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card sticky top-24 space-y-5 p-6">
            <h3 className="font-bold text-slate-900">Detalhes do envio</h3>

            <div className="rounded-2xl border border-dashed border-slate-200 p-4">
              {selected ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-cyan-600 text-sm font-bold text-white">
                    {selected.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{selected.nome}</p>
                    <p className="text-xs text-slate-500">{selected.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Selecione um aluno na lista ao lado</p>
              )}
            </div>

            <div>
              <label className="label">Quantidade de moedas</label>
              <div className="relative">
                <Coins size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="number"
                  min="1"
                  className="input pl-10"
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <MessageSquare size={14} /> Mensagem / Motivo <span className="text-rose-500">*</span>
              </label>
              <textarea
                className="input min-h-[96px] resize-none"
                placeholder="Ex.: Excelente participação nas aulas..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={sending}>
              <Send size={18} />
              {sending ? 'Enviando...' : 'Enviar moedas'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
