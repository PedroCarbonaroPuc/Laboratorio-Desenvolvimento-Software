import { AnimatePresence, motion } from 'framer-motion'
import { type Dispatch, type FormEvent, type SetStateAction, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Benefit, Institution, Role } from '../../types'

export type PublicMode = 'landing' | 'login' | 'student-register' | 'partner-register'

export type LoginFormState = {
  login: string
  password: string
  role: Role
}

export type StudentRegisterFormState = {
  name: string
  email: string
  cpf: string
  rg: string
  address: string
  institutionId: string
  course: string
  password: string
}

export type PartnerRegisterFormState = {
  companyName: string
  contactName: string
  email: string
  cnpj: string
  address: string
  password: string
}

type PublicExperienceProps = {
  mode: PublicMode
  loginForm: LoginFormState
  setLoginForm: Dispatch<SetStateAction<LoginFormState>>
  studentRegisterForm: StudentRegisterFormState
  setStudentRegisterForm: Dispatch<SetStateAction<StudentRegisterFormState>>
  partnerRegisterForm: PartnerRegisterFormState
  setPartnerRegisterForm: Dispatch<SetStateAction<PartnerRegisterFormState>>
  institutions: Institution[]
  publicBenefits: Benefit[]
  isBusy: boolean
  onLogin: (event: FormEvent<HTMLFormElement>) => void
  onStudentRegister: (event: FormEvent<HTMLFormElement>) => void
  onPartnerRegister: (event: FormEvent<HTMLFormElement>) => void
}

const modeText: Record<PublicMode, { title: string; subtitle: string }> = {
  landing: {
    title: 'Design de reconhecimento com cara de produto premium',
    subtitle: 'Uma interface que valoriza foco, ritmo visual e operacao de ponta a ponta.',
  },
  login: {
    title: 'Acesse seu universo de moedas',
    subtitle: 'Entradas inteligentes para aluno, professor e parceiro sem perder contexto.',
  },
  'student-register': {
    title: 'Onboarding de aluno',
    subtitle: 'Cadastro orientado para iniciar a jornada de recompensas do campus.',
  },
  'partner-register': {
    title: 'Onboarding de parceiro',
    subtitle: 'Crie um ponto de presença premium no ecossistema de vantagens.',
  },
}

const roleHints: Record<Role, string> = {
  STUDENT: 'Use e-mail ou CPF para acompanhar saldo, resgates e extrato.',
  PROFESSOR: 'Acesse por e-mail ou CPF para distribuir moedas com contexto pedagógico.',
  PARTNER: 'Entre com e-mail ou CNPJ para publicar e operar vantagens.',
}

const spotlightCards = [
  {
    key: 'rastro',
    title: 'Rastro de mérito',
    text: 'Cada movimentação fica auditável para transparência acadêmica.',
  },
  {
    key: 'resgate',
    title: 'Resgate instantâneo',
    text: 'Cupons gerados em segundos para experiências reais no campus.',
  },
  {
    key: 'governanca',
    title: 'Governança operacional',
    text: 'Fluxos por papel com controle de sessão e segurança por contexto.',
  },
] as const

type SpotlightKey = (typeof spotlightCards)[number]['key']

const roleLabel: Record<Role, string> = {
  STUDENT: 'Aluno',
  PROFESSOR: 'Professor',
  PARTNER: 'Parceiro',
}

const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

function panelMotion(delay = 0) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.28, delay, ease: EASE_OUT },
  }
}

export function PublicExperience({
  mode,
  loginForm,
  setLoginForm,
  studentRegisterForm,
  setStudentRegisterForm,
  partnerRegisterForm,
  setPartnerRegisterForm,
  institutions,
  publicBenefits,
  isBusy,
  onLogin,
  onStudentRegister,
  onPartnerRegister,
}: PublicExperienceProps) {
  const [spotlight, setSpotlight] = useState<SpotlightKey>(spotlightCards[0].key)

  const spotlightData = useMemo(
    () => spotlightCards.find((item) => item.key === spotlight) ?? spotlightCards[0],
    [spotlight],
  )

  const topBenefits = useMemo(() => publicBenefits.slice(0, 6), [publicBenefits])

  return (
    <div className="showcase-grid">
      <motion.section className="showcase-hero" {...panelMotion()}>
        <p className="eyebrow">CampusCoin / Premium Edition</p>
        <h2>{modeText[mode].title}</h2>
        <p className="hero-subtitle">{modeText[mode].subtitle}</p>

        <div className="hero-kpi-grid">
          <article>
            <span>Instituições ativas</span>
            <strong>{institutions.length}</strong>
          </article>
          <article>
            <span>Benefícios no ar</span>
            <strong>{publicBenefits.length}</strong>
          </article>
          <article>
            <span>Perfis com fluxo dedicado</span>
            <strong>3</strong>
          </article>
        </div>

        <div className="spotlight-pills">
          {spotlightCards.map((item) => (
            <button
              key={item.key}
              type="button"
              className={spotlight === item.key ? 'active' : ''}
              onClick={() => setSpotlight(item.key)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <motion.div key={spotlightData.key} className="spotlight-card" {...panelMotion()}>
          <h4>{spotlightData.title}</h4>
          <p>{spotlightData.text}</p>
        </motion.div>

        <div className="quick-links">
          <Link to="/acesso">Entrar agora</Link>
          <Link to="/vitrine">Ver vitrine</Link>
          <Link to="/cadastro/aluno">Sou aluno</Link>
          <Link to="/cadastro/parceiro">Sou parceiro</Link>
        </div>
      </motion.section>

      <motion.section className="showcase-auth" {...panelMotion(0.05)}>
        <nav className="showcase-tabs" aria-label="Fluxos públicos">
          <Link to="/" className={mode === 'landing' ? 'active' : ''}>
            Showcase
          </Link>
          <Link to="/acesso" className={mode === 'login' ? 'active' : ''}>
            Acesso
          </Link>
          <Link to="/cadastro/aluno" className={mode === 'student-register' ? 'active' : ''}>
            Cadastro aluno
          </Link>
          <Link to="/cadastro/parceiro" className={mode === 'partner-register' ? 'active' : ''}>
            Cadastro parceiro
          </Link>
        </nav>

        <AnimatePresence mode="wait" initial={false}>
          {mode === 'landing' ? (
            <motion.div key="overview-panel" className="overview-panel" {...panelMotion()}>
              <p>
                A nova composição visual abandona o layout anterior e trabalha com narrativa de produto: abertura,
                escolha de trilha e entrada contextual no sistema.
              </p>
              <p>
                Navegue pelos fluxos acima para experimentar login, onboarding de aluno e onboarding de parceiro com
                linguagem visual consistente.
              </p>
            </motion.div>
          ) : null}

          {mode === 'login' ? (
            <motion.form key="login-panel" className="auth-form" onSubmit={onLogin} {...panelMotion()}>
              <label>
                Perfil de acesso
                <div className="role-capsules">
                  {(Object.keys(roleLabel) as Role[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      className={loginForm.role === role ? 'active' : ''}
                      onClick={() => setLoginForm((current) => ({ ...current, role }))}
                    >
                      {roleLabel[role]}
                    </button>
                  ))}
                </div>
              </label>

              <label>
                Login (email, CPF ou CNPJ)
                <input
                  value={loginForm.login}
                  onChange={(event) => setLoginForm((current) => ({ ...current, login: event.target.value }))}
                  required
                />
              </label>

              <label>
                Senha
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>

              <div className="context-note">
                <strong>Dica de acesso</strong>
                <p>{roleHints[loginForm.role]}</p>
              </div>

              <button className="cta-button" type="submit" disabled={isBusy}>
                {isBusy ? 'Validando sessão...' : 'Entrar no portal'}
              </button>
            </motion.form>
          ) : null}

          {mode === 'student-register' ? (
            <motion.form key="student-register" className="auth-form" onSubmit={onStudentRegister} {...panelMotion()}>
              <div className="step-ribbon">
                <span className="done">1. Identidade</span>
                <span className="active">2. Vínculo</span>
                <span>3. Segurança</span>
              </div>

              <label>
                Nome
                <input
                  value={studentRegisterForm.name}
                  onChange={(event) =>
                    setStudentRegisterForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={studentRegisterForm.email}
                  onChange={(event) =>
                    setStudentRegisterForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                CPF
                <input
                  value={studentRegisterForm.cpf}
                  onChange={(event) =>
                    setStudentRegisterForm((current) => ({
                      ...current,
                      cpf: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                RG
                <input
                  value={studentRegisterForm.rg}
                  onChange={(event) =>
                    setStudentRegisterForm((current) => ({
                      ...current,
                      rg: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Endereço
                <input
                  value={studentRegisterForm.address}
                  onChange={(event) =>
                    setStudentRegisterForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Curso
                <input
                  value={studentRegisterForm.course}
                  onChange={(event) =>
                    setStudentRegisterForm((current) => ({
                      ...current,
                      course: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Instituição
                <select
                  value={studentRegisterForm.institutionId}
                  onChange={(event) =>
                    setStudentRegisterForm((current) => ({
                      ...current,
                      institutionId: event.target.value,
                    }))
                  }
                  required
                >
                  {institutions.length === 0 ? <option value="">Nenhuma instituição carregada</option> : null}
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name} - {institution.campus}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Senha
                <input
                  type="password"
                  value={studentRegisterForm.password}
                  onChange={(event) =>
                    setStudentRegisterForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <button className="cta-button" type="submit" disabled={isBusy}>
                Criar conta de aluno
              </button>
            </motion.form>
          ) : null}

          {mode === 'partner-register' ? (
            <motion.form key="partner-register" className="auth-form" onSubmit={onPartnerRegister} {...panelMotion()}>
              <div className="step-ribbon">
                <span className="done">1. Empresa</span>
                <span className="active">2. Contato</span>
                <span>3. Publicação</span>
              </div>

              <label>
                Nome da empresa
                <input
                  value={partnerRegisterForm.companyName}
                  onChange={(event) =>
                    setPartnerRegisterForm((current) => ({
                      ...current,
                      companyName: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Contato responsável
                <input
                  value={partnerRegisterForm.contactName}
                  onChange={(event) =>
                    setPartnerRegisterForm((current) => ({
                      ...current,
                      contactName: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={partnerRegisterForm.email}
                  onChange={(event) =>
                    setPartnerRegisterForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                CNPJ
                <input
                  value={partnerRegisterForm.cnpj}
                  onChange={(event) =>
                    setPartnerRegisterForm((current) => ({
                      ...current,
                      cnpj: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Endereço
                <input
                  value={partnerRegisterForm.address}
                  onChange={(event) =>
                    setPartnerRegisterForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Senha
                <input
                  type="password"
                  value={partnerRegisterForm.password}
                  onChange={(event) =>
                    setPartnerRegisterForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <button className="cta-button" type="submit" disabled={isBusy}>
                Criar conta de parceiro
              </button>
            </motion.form>
          ) : null}
        </AnimatePresence>
      </motion.section>

      <motion.section className="showcase-catalog" {...panelMotion(0.1)}>
        <header>
          <h3>Vitrine ativa</h3>
          <span>{publicBenefits.length} benefícios</span>
        </header>

        <div className="catalog-grid">
          {topBenefits.map((benefit, index) => (
            <motion.article
              key={benefit.id}
              className="catalog-card"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.24, delay: Math.min(index * 0.05, 0.2), ease: EASE_OUT }}
            >
              <img src={benefit.imageUrl} alt={benefit.title} loading="lazy" />
              <div>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
              <footer>
                <small>{benefit.partnerName}</small>
                <strong>{benefit.costCoins} moedas</strong>
              </footer>
            </motion.article>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
