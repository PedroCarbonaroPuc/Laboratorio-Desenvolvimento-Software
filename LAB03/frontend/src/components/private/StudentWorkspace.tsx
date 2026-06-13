import { motion } from 'framer-motion'
import { type Dispatch, type FormEvent, type SetStateAction, useMemo } from 'react'
import type { Benefit, Statement, StudentProfile } from '../../types'
import { TransactionTimeline } from '../shared/TransactionTimeline'

export type StudentUpdateFormState = {
  name: string
  address: string
  course: string
  password: string
}

type StudentWorkspaceProps = {
  profile: StudentProfile
  statement: Statement
  form: StudentUpdateFormState
  setForm: Dispatch<SetStateAction<StudentUpdateFormState>>
  publicBenefits: Benefit[]
  selectedBenefitId: string
  setSelectedBenefitId: Dispatch<SetStateAction<string>>
  isBusy: boolean
  onUpdate: (event: FormEvent<HTMLFormElement>) => void
  onDelete: () => void
  onRedeem: () => void
  dateFormatter: Intl.DateTimeFormat
}

const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

export function StudentWorkspace({
  profile,
  statement,
  form,
  setForm,
  publicBenefits,
  selectedBenefitId,
  setSelectedBenefitId,
  isBusy,
  onUpdate,
  onDelete,
  onRedeem,
  dateFormatter,
}: StudentWorkspaceProps) {
  const selectedBenefit = useMemo(
    () => publicBenefits.find((benefit) => benefit.id === selectedBenefitId) ?? null,
    [publicBenefits, selectedBenefitId],
  )

  const redemptionHistory = useMemo(
    () => statement.transactions.filter((transaction) => transaction.type === 'REDEMPTION').slice(0, 6),
    [statement.transactions],
  )

  return (
    <section className="workspace-mosaic">
      <motion.article
        className="studio-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
      >
        <header className="card-head">
          <h3>Identidade acadêmica</h3>
          <span className="micro-tag">ID {profile.id}</span>
        </header>

        <form className="studio-form" onSubmit={onUpdate}>
          <label>
            Nome
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </label>

          <label>
            Endereço
            <input
              value={form.address}
              onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            />
          </label>

          <label>
            Curso
            <input value={form.course} onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))} />
          </label>

          <label>
            Nova senha (opcional)
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </label>

          <div className="studio-actions">
            <button className="cta-button" type="submit" disabled={isBusy}>
              Salvar perfil
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
          <h3>Lab de resgate</h3>
          <span className="micro-tag">Saldo {statement.balance}</span>
        </header>

        <label>
          Escolha um benefício
          <select value={selectedBenefitId} onChange={(event) => setSelectedBenefitId(event.target.value)}>
            <option value="">Selecione...</option>
            {publicBenefits.map((benefit) => (
              <option key={benefit.id} value={benefit.id}>
                {benefit.title} - {benefit.costCoins} moedas
              </option>
            ))}
          </select>
        </label>

        {selectedBenefit ? (
          <motion.article
            key={selectedBenefit.id}
            className="benefit-preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <img src={selectedBenefit.imageUrl} alt={selectedBenefit.title} loading="lazy" />
            <div>
              <h4>{selectedBenefit.title}</h4>
              <p>{selectedBenefit.description}</p>
              <small>
                Parceiro: {selectedBenefit.partnerName} | Custo: {selectedBenefit.costCoins}
              </small>
            </div>
          </motion.article>
        ) : null}

        <button className="cta-button redeem-trigger" type="button" onClick={onRedeem} disabled={isBusy || !selectedBenefitId}>
          Gerar cupom de resgate
        </button>

        <section className="redemption-history" aria-label="Resgates realizados pelo aluno">
          <header>
            <h4>Resgates recentes</h4>
            <span>{redemptionHistory.length} registros</span>
          </header>

          {redemptionHistory.length === 0 ? (
            <p className="muted">Voce ainda nao realizou resgates.</p>
          ) : (
            <ul>
              {redemptionHistory.map((transaction) => (
                <li key={transaction.id}>
                  <div>
                    <strong>{transaction.description}</strong>
                    <small>{dateFormatter.format(new Date(transaction.createdAt))}</small>
                  </div>
                  <div>
                    <small>{transaction.couponCode ? `Cupom ${transaction.couponCode}` : 'Sem cupom'}</small>
                    <strong>{transaction.amount} moedas</strong>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </motion.article>

      <motion.article
        className="studio-card span-full"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1, ease: EASE_OUT }}
      >
        <header className="card-head">
          <h3>Ledger do aluno</h3>
          <span className="micro-tag">{statement.transactions.length} eventos</span>
        </header>
        <TransactionTimeline statement={statement} dateFormatter={dateFormatter} />
      </motion.article>
    </section>
  )
}
