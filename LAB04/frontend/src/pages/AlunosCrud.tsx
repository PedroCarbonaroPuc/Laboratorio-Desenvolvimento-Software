import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Users, Plus, Pencil, Trash2, Search, Coins } from 'lucide-react'
import api, { extractError } from '../api/client'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { Spinner, EmptyState } from '../components/ui/Feedback'

const EMPTY = {
  nome: '', email: '', cpf: '', rg: '', endereco: '',
  curso: '', instituicaoId: '', login: '', senha: '',
}

export default function AlunosCrud() {
  const [alunos, setAlunos] = useState([])
  const [instituicoes, setInstituicoes] = useState([])
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
      const [a, i] = await Promise.all([api.get('/alunos'), api.get('/instituicoes')])
      setAlunos(a.data)
      setInstituicoes(i.data)
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
    setForm({ ...EMPTY, instituicaoId: instituicoes[0]?.id || '' })
    setModalOpen(true)
  }

  function openEdit(aluno) {
    setEditing(aluno)
    setForm({
      nome: aluno.nome, email: aluno.email, cpf: aluno.cpf, rg: aluno.rg,
      endereco: aluno.endereco, curso: aluno.curso, instituicaoId: aluno.instituicaoId,
      login: aluno.login, senha: '',
    })
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
        const { nome, email, cpf, rg, endereco, curso, instituicaoId } = form
        await api.put(`/alunos/${editing.id}`, { nome, email, cpf, rg, endereco, curso, instituicaoId })
        toast.success('Aluno atualizado com sucesso!')
      } else {
        await api.post('/alunos', form)
        toast.success('Aluno cadastrado com sucesso!')
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
      await api.delete(`/alunos/${toDelete.id}`)
      toast.success('Aluno removido.')
      setToDelete(null)
      load()
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setDeleting(false)
    }
  }

  const filtered = alunos.filter((a) =>
    [a.nome, a.email, a.cpf, a.curso].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-600 text-white">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Gerenciar Alunos</h1>
            <p className="text-sm text-slate-500">{alunos.length} aluno(s) cadastrado(s)</p>
          </div>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Novo aluno
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-10"
          placeholder="Buscar por nome, email, CPF ou curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum aluno encontrado"
          message="Cadastre o primeiro aluno para começar."
          action={<button className="btn-primary" onClick={openCreate}><Plus size={18} /> Novo aluno</button>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5">Aluno</th>
                  <th className="px-5 py-3.5">CPF</th>
                  <th className="px-5 py-3.5">Curso</th>
                  <th className="px-5 py-3.5">Instituição</th>
                  <th className="px-5 py-3.5">Saldo</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((a) => (
                  <tr key={a.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-cyan-600 text-xs font-bold text-white">
                          {a.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{a.nome}</p>
                          <p className="text-xs text-slate-500">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{a.cpf}</td>
                    <td className="px-5 py-3.5 text-slate-600">{a.curso}</td>
                    <td className="px-5 py-3.5 text-slate-600">{a.instituicaoNome}</td>
                    <td className="px-5 py-3.5">
                      <span className="badge bg-amber-50 text-amber-700"><Coins size={12} /> {a.saldo}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600" onClick={() => openEdit(a)}>
                          <Pencil size={16} />
                        </button>
                        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600" onClick={() => setToDelete(a)}>
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
        title={editing ? 'Editar aluno' : 'Novo aluno'}
        subtitle={editing ? 'Atualize os dados do aluno' : 'Preencha os dados do novo aluno'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Nome completo</label>
              <input className="input" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">CPF</label>
              <input className="input" value={form.cpf} onChange={(e) => set('cpf', e.target.value)} required />
            </div>
            <div>
              <label className="label">RG</label>
              <input className="input" value={form.rg} onChange={(e) => set('rg', e.target.value)} required />
            </div>
            <div>
              <label className="label">Curso</label>
              <input className="input" value={form.curso} onChange={(e) => set('curso', e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Endereço</label>
              <input className="input" value={form.endereco} onChange={(e) => set('endereco', e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Instituição</label>
              <select className="input" value={form.instituicaoId} onChange={(e) => set('instituicaoId', e.target.value)} required>
                <option value="" disabled>Selecione...</option>
                {instituicoes.map((i) => (
                  <option key={i.id} value={i.id}>{i.nome} — {i.cidade}</option>
                ))}
              </select>
            </div>
            {!editing && (
              <>
                <div>
                  <label className="label">Login</label>
                  <input className="input" value={form.login} onChange={(e) => set('login', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Senha</label>
                  <input type="password" className="input" value={form.senha} onChange={(e) => set('senha', e.target.value)} required minLength={4} />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Cadastrar aluno'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remover aluno"
        message={`Tem certeza que deseja remover ${toDelete?.nome}? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
      />
    </div>
  )
}
