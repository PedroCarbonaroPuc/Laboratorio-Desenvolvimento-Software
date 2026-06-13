import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Building2, Plus, Pencil, Trash2, Search } from 'lucide-react'
import api, { extractError } from '../api/client'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { Spinner, EmptyState } from '../components/ui/Feedback'

const EMPTY = { nome: '', email: '', cnpj: '', login: '', senha: '' }

export default function EmpresasCrud() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/empresas')
      setEmpresas(data)
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

  function openEdit(empresa) {
    setEditing(empresa)
    setForm({ nome: empresa.nome, email: empresa.email, cnpj: empresa.cnpj, login: empresa.login, senha: '' })
    setModalOpen(true)
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const { nome, email, cnpj } = form
        await api.put(`/empresas/${editing.id}`, { nome, email, cnpj })
        toast.success('Empresa atualizada com sucesso!')
      } else {
        await api.post('/empresas', form)
        toast.success('Empresa cadastrada com sucesso!')
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
      await api.delete(`/empresas/${toDelete.id}`)
      toast.success('Empresa removida.')
      setToDelete(null)
      load()
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setDeleting(false)
    }
  }

  const filtered = empresas.filter((e) =>
    [e.nome, e.email, e.cnpj].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Gerenciar Empresas</h1>
            <p className="text-sm text-slate-500">{empresas.length} empresa(s) parceira(s)</p>
          </div>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Nova empresa
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-10"
          placeholder="Buscar por nome, email ou CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Nenhuma empresa encontrada"
          message="Cadastre a primeira empresa parceira."
          action={<button className="btn-primary" onClick={openCreate}><Plus size={18} /> Nova empresa</button>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5">Empresa</th>
                  <th className="px-5 py-3.5">CNPJ</th>
                  <th className="px-5 py-3.5">Login</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((e) => (
                  <tr key={e.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-xs font-bold text-white">
                          {e.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{e.nome}</p>
                          <p className="text-xs text-slate-500">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{e.cnpj}</td>
                    <td className="px-5 py-3.5 text-slate-600">{e.login}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600" onClick={() => openEdit(e)}>
                          <Pencil size={16} />
                        </button>
                        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600" onClick={() => setToDelete(e)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar empresa' : 'Nova empresa'}
        subtitle={editing ? 'Atualize os dados da empresa' : 'Preencha os dados da nova empresa'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nome da empresa</label>
            <input className="input" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">CNPJ</label>
              <input className="input" value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} required />
            </div>
          </div>
          {!editing && (
            <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <div>
                <label className="label">Login</label>
                <input className="input" value={form.login} onChange={(e) => set('login', e.target.value)} required />
              </div>
              <div>
                <label className="label">Senha</label>
                <input type="password" className="input" value={form.senha} onChange={(e) => set('senha', e.target.value)} required minLength={4} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Cadastrar empresa'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remover empresa"
        message={`Tem certeza que deseja remover ${toDelete?.nome}? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
      />
    </div>
  )
}
