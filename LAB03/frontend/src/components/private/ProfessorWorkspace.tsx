import { motion } from 'framer-motion'
import { type Dispatch, type FormEvent, type SetStateAction } from 'react'
import type { ProfessorProfile, Statement, StudentProfile } from '../../types'
import { TransactionTimeline } from '../shared/TransactionTimeline'

export type TransferFormState = {
  studentId: string
  amount: number
  message: string
}

type ProfessorWorkspaceProps = {
  profile: ProfessorProfile
  statement: Statement
  students: StudentProfile[]
  transfer: TransferFormState
  setTransfer: Dispatch<SetStateAction<TransferFormState>>
  isBusy: boolean
  onTransfer: (event: FormEvent<HTMLFormElement>) => void
  dateFormatter: Intl.DateTimeFormat
}

const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

export function ProfessorWorkspace({
  profile,
  statement,
  students,
  transfer,
  setTransfer,
  isBusy,
  onTransfer,
  dateFormatter,
}: ProfessorWorkspaceProps) {
  return (
    <section className="workspace-mosaic">
      <motion.article
        className="studio-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
      >
        <header className="card-head">
          <h3>Perfil docente</h3>
          <span className="micro-tag">Saldo {profile.balance}</span>
        </header>

        <dl className="insight-grid">
          <div>
            <dt>Nome</dt>
            <dd>{profile.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>Departamento</dt>
            <dd>{profile.department}</dd>
          </div>
          <div>
            <dt>Instituição</dt>
            <dd>{profile.institutionId}</dd>
          </div>
        </dl>
      </motion.article>

      <motion.article
        className="studio-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05, ease: EASE_OUT }}
      >
        <header className="card-head">
          <h3>Compositor de mérito</h3>
          <span className="micro-tag">{students.length} alunos</span>
        </header>

        <form className="studio-form" onSubmit={onTransfer}>
          <label>
            Aluno destino
            <select
              value={transfer.studentId}
              onChange={(event) => setTransfer((current) => ({ ...current, studentId: event.target.value }))}
              required
            >
              <option value="">Selecione...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.course})
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantidade de moedas
            <input
              type="number"
              min={1}
              value={transfer.amount}
              onChange={(event) => setTransfer((current) => ({ ...current, amount: Number(event.target.value) }))}
              required
            />
          </label>

          <label>
            Mensagem de reconhecimento
            <textarea
              value={transfer.message}
              onChange={(event) => setTransfer((current) => ({ ...current, message: event.target.value }))}
              required
            />
          </label>

          <button className="cta-button" type="submit" disabled={isBusy}>
            Confirmar distribuição
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
          <h3>Ledger do professor</h3>
          <span className="micro-tag">{statement.transactions.length} eventos</span>
        </header>
        <TransactionTimeline statement={statement} dateFormatter={dateFormatter} />
      </motion.article>
    </section>
  )
}
