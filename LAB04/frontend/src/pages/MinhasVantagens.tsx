import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Tag, Plus, Pencil, Trash2, Coins } from 'lucide-react'
import api, { extractError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { Spinner, EmptyState } from '../components/ui/Feedback'

const EMPTY = { nome: '', descricao: '', foto: '', custoMoedas: '' }
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="%23eef2ff"/><text x="50%25" y="50%25" font-size="20" fill="%236366f1" text-anchor="middle" dy=".3em" font-family="Arial">Sem imagem</text></svg>'

export default function MinhasVantagens() {
  const { user } = useAuth()
  const [vantagens, setVantagens] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/vantagens/minhas')
      setVantagens(data)
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  function openEdit(v) {
    setEditing(v)
    setForm({ nome: v.nome, descricao: v.descricao, foto: v.foto, custoMoedas: v.custoMoedas })
    setModalOpen(true)
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, custoMoedas: Number(form.custoMoedas) }
      if (editing) {
        await api.put(`/vantagens/${editing.id}`, payload)
        toast.success('Vantagem atualizada!')
      } else {
        await api.post('/vantagens', payload)
        toast.success('Vantagem cadastrada!')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/vantagens/${toDelete.id}`)
      toast.success('Vantagem removida.')
      setToDelete(null)
      load()
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <Tag size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Minhas Vantagens</h1>
            <p className="text-sm text-slate-500">{vantagens.length} vantagem(ns) cadastrada(s)</p>
          </div>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Nova vantagem
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : vantagens.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Nenhuma vantagem cadastrada"
          message="Cadastre vantagens para que os alunos possam resgatá-las."
          action={<button className="btn-primary" onClick={openCreate}><Plus size={18} /> Nova vantagem</button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vantagens.map((v) => (
            <div key={v.id} className="card overflow-hidden">
              <div className="h-40 overflow-hidden bg-slate-100">
                <img
                  src={v.foto || FALLBACK_IMG}
                  alt={v.nome}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900">{v.nome}</h3>
                  <span className="badge shrink-0 bg-amber-50 text-amber-700"><Coins size={12} /> {v.custoMoedas}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{v.descricao}</p>
                <div className="mt-4 flex gap-2">
                  <button className="btn-secondary flex-1" onClick={() => openEdit(v)}>
                    <Pencil size={15} /> Editar
                  </button>
                  <button className="btn-danger" onClick={() => setToDelete(v)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar vantagem' : 'Nova vantagem'}
        subtitle="Informe os dados da vantagem oferecida"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nome</label>
            <input className="input" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea className="input min-h-[80px] resize-none" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Custo (moedas)</label>
              <input type="number" min="1" className="input" value={form.custoMoedas} onChange={(e) => set('custoMoedas', e.target.value)} required />
            </div>
            <div>
              <label className="label">URL da foto</label>
              <input className="input" placeholder="https://..." value={form.foto} onChange={(e) => set('foto', e.target.value)} required />
            </div>
          </div>
          {form.foto && (
            <img
              src={form.foto}
              alt="preview"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              className="h-32 w-full rounded-xl object-cover"
            />
          )}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remover vantagem"
        message={`Deseja remover "${toDelete?.nome}"?`}
        confirmLabel="Remover"
      />
    </div>
  )
}
