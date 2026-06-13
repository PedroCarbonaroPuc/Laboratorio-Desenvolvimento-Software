import { motion } from 'framer-motion'
import { type Dispatch, type FormEvent, type SetStateAction } from 'react'
import type { Benefit, PartnerProfile } from '../../types'

export type PartnerUpdateFormState = {
  companyName: string
  contactName: string
  address: string
  password: string
}

export type BenefitCreateFormState = {
  title: string
  description: string
  imageUrl: string
  costCoins: number
}

type PartnerWorkspaceProps = {
  profile: PartnerProfile
  updateForm: PartnerUpdateFormState
  setUpdateForm: Dispatch<SetStateAction<PartnerUpdateFormState>>
  createForm: BenefitCreateFormState
  setCreateForm: Dispatch<SetStateAction<BenefitCreateFormState>>
  partnerBenefits: Benefit[]
  isBusy: boolean
  onUpdate: (event: FormEvent<HTMLFormElement>) => void
  onDelete: () => void
  onCreateBenefit: (event: FormEvent<HTMLFormElement>) => void
  onToggleBenefit: (benefit: Benefit) => void
  onDeleteBenefit: (benefitId: string) => void
}

const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

export function PartnerWorkspace({
  profile,
  updateForm,
  setUpdateForm,
  createForm,
  setCreateForm,
  partnerBenefits,
  isBusy,
  onUpdate,
  onDelete,
  onCreateBenefit,
  onToggleBenefit,
  onDeleteBenefit,
}: PartnerWorkspaceProps) {
  const activeCount = partnerBenefits.filter((benefit) => benefit.active).length

  return (
    <section className="workspace-mosaic">
      <motion.article
        className="studio-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
      >
        <header className="card-head">
          <h3>Identidade da empresa</h3>
          <span className="micro-tag">ID {profile.id}</span>
        </header>

        <form className="studio-form" onSubmit={onUpdate}>
          <label>
            Nome da empresa
            <input
              value={updateForm.companyName}
              onChange={(event) => setUpdateForm((current) => ({ ...current, companyName: event.target.value }))}
            />
          </label>

          <label>
            Contato responsável
            <input
              value={updateForm.contactName}
              onChange={(event) => setUpdateForm((current) => ({ ...current, contactName: event.target.value }))}
            />
          </label>

          <label>
            Endereço
            <input
              value={updateForm.address}
              onChange={(event) => setUpdateForm((current) => ({ ...current, address: event.target.value }))}
            />
          </label>

          <label>
            Nova senha (opcional)
            <input
              type="password"
              value={updateForm.password}
              onChange={(event) => setUpdateForm((current) => ({ ...current, password: event.target.value }))}
            />
          </label>

          <div className="studio-actions">
            <button className="cta-button" type="submit" disabled={isBusy}>
              Atualizar parceiro
            </button>
            <button className="ghost-button danger" type="button" onClick={onDelete} disabled={isBusy}>
              Excluir conta
            </button>
          </div>
        </form>
      </motion.article>

      <motion.article
        className="studio-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05, ease: EASE_OUT }}
      >
        <header className="card-head">
          <h3>Publicar vantagem</h3>
          <span className="micro-tag">Ativas {activeCount}</span>
        </header>

        <form className="studio-form" onSubmit={onCreateBenefit}>
          <label>
            Título
            <input
              value={createForm.title}
              onChange={(event) => setCreateForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              value={createForm.description}
              onChange={(event) => setCreateForm((current) => ({ ...current, description: event.target.value }))}
              required
            />
          </label>

          <label>
            URL da imagem
            <input
              value={createForm.imageUrl}
              onChange={(event) => setCreateForm((current) => ({ ...current, imageUrl: event.target.value }))}
              required
            />
          </label>

          <label>
            Custo em moedas
            <input
              type="number"
              min={1}
              value={createForm.costCoins}
              onChange={(event) => setCreateForm((current) => ({ ...current, costCoins: Number(event.target.value) }))}
              required
            />
          </label>

          <button className="cta-button" type="submit" disabled={isBusy}>
            Publicar agora
          </button>
        </form>
      </motion.article>

      <motion.article
        className="studio-card span-full"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1, ease: EASE_OUT }}
      >
        <header className="card-head">
          <h3>Board de catálogo</h3>
          <span className="micro-tag">Total {partnerBenefits.length}</span>
        </header>

        <div className="catalog-grid">
          {partnerBenefits.map((benefit) => (
            <article key={benefit.id} className="catalog-card">
              <img src={benefit.imageUrl} alt={benefit.title} loading="lazy" />
              <div>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
              <footer>
                <small>{benefit.costCoins} moedas</small>
                <span className={`state-chip ${benefit.active ? 'active' : 'inactive'}`}>
                  {benefit.active ? 'Ativa' : 'Inativa'}
                </span>
                <div className="studio-actions compact">
                  <button className="ghost-button" type="button" onClick={() => onToggleBenefit(benefit)}>
                    {benefit.active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button className="ghost-button danger" type="button" onClick={() => onDeleteBenefit(benefit.id)}>
                    Excluir
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </motion.article>
    </section>
  )
}
