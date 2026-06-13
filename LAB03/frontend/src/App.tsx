import { AnimatePresence, motion } from 'framer-motion'
import { type CSSProperties, type FormEvent, useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { PartnerWorkspace } from './components/private/PartnerWorkspace'
import type { BenefitCreateFormState, PartnerUpdateFormState } from './components/private/PartnerWorkspace'
import { ProfessorWorkspace } from './components/private/ProfessorWorkspace'
import type { TransferFormState } from './components/private/ProfessorWorkspace'
import { StudentWorkspace } from './components/private/StudentWorkspace'
import type { StudentUpdateFormState } from './components/private/StudentWorkspace'
import { ProductShowcasePage } from './components/public/ProductShowcasePage'
import { PublicExperience } from './components/public/PublicExperience'
import type {
  LoginFormState,
  PartnerRegisterFormState,
  PublicMode,
  StudentRegisterFormState,
} from './components/public/PublicExperience'
import './App.css'
import { api } from './services/api'
import type {
  Benefit,
  DashboardSummary,
  Institution,
  PartnerProfile,
  ProfessorProfile,
  Role,
  Statement,
  StudentProfile,
} from './types'

type AuthState = {
  token: string
  role: Role
  userId: string
  displayName: string
}

type StatusTone = 'info' | 'success' | 'error'

const STORAGE_KEY = 'campuscoin-auth'
const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

function readStoredAuth(): AuthState | null {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as AuthState
    if (parsed.token && parsed.role && parsed.userId) {
      return parsed
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return null
}

function pathForRole(role: Role) {
  switch (role) {
    case 'STUDENT':
      return '/portal/aluno'
    case 'PROFESSOR':
      return '/portal/professor'
    case 'PARTNER':
      return '/portal/parceiro'
  }
}

function titleForRole(role: Role) {
  switch (role) {
    case 'STUDENT':
      return 'Mesa de Jornada do Aluno'
    case 'PROFESSOR':
      return 'Mesa de Distribuicao do Professor'
    case 'PARTNER':
      return 'Mesa de Operacao do Parceiro'
  }
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const [auth, setAuth] = useState<AuthState | null>(readStoredAuth)
  const [isBusy, setIsBusy] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: 24, y: 18 })

  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [publicBenefits, setPublicBenefits] = useState<Benefit[]>([])

  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [studentStatement, setStudentStatement] = useState<Statement | null>(null)
  const [selectedBenefitId, setSelectedBenefitId] = useState('')

  const [professorProfile, setProfessorProfile] = useState<ProfessorProfile | null>(null)
  const [professorStatement, setProfessorStatement] = useState<Statement | null>(null)
  const [students, setStudents] = useState<StudentProfile[]>([])

  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null)
  const [partnerBenefits, setPartnerBenefits] = useState<Benefit[]>([])

  const [loginForm, setLoginForm] = useState<LoginFormState>({
    login: '',
    password: '',
    role: 'STUDENT',
  })

  const [studentRegisterForm, setStudentRegisterForm] = useState<StudentRegisterFormState>({
    name: '',
    email: '',
    cpf: '',
    rg: '',
    address: '',
    institutionId: '',
    course: '',
    password: '',
  })

  const [partnerRegisterForm, setPartnerRegisterForm] = useState<PartnerRegisterFormState>({
    companyName: '',
    contactName: '',
    email: '',
    cnpj: '',
    address: '',
    password: '',
  })

  const [studentUpdateForm, setStudentUpdateForm] = useState<StudentUpdateFormState>({
    name: '',
    address: '',
    course: '',
    password: '',
  })

  const [transferForm, setTransferForm] = useState<TransferFormState>({
    studentId: '',
    amount: 1,
    message: '',
  })

  const [partnerUpdateForm, setPartnerUpdateForm] = useState<PartnerUpdateFormState>({
    companyName: '',
    contactName: '',
    address: '',
    password: '',
  })

  const [benefitCreateForm, setBenefitCreateForm] = useState<BenefitCreateFormState>({
    title: '',
    description: '',
    imageUrl: '',
    costCoins: 100,
  })

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    [],
  )

  const shellStyle: CSSProperties = {
    '--spotlight-x': `${spotlight.x}%`,
    '--spotlight-y': `${spotlight.y}%`,
  } as CSSProperties

  useEffect(() => {
    void refreshPublicData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!auth) {
      resetPrivateState()
      return
    }

    void refreshPrivateData(auth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  async function refreshPublicData() {
    try {
      const [institutionList, benefitList] = await Promise.all([api.institutions(), api.listBenefits()])
      setInstitutions(institutionList)
      setPublicBenefits(benefitList)

      setStudentRegisterForm((current) => {
        if (current.institutionId || institutionList.length === 0) {
          return current
        }

        return { ...current, institutionId: institutionList[0].id }
      })

      setSelectedBenefitId((current) => {
        if (current || benefitList.length === 0) {
          return current
        }

        return benefitList[0].id
      })
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    }
  }

  async function refreshPrivateData(currentAuth: AuthState) {
    try {
      const summary = await api.dashboardSummary(currentAuth.token)
      setDashboard(summary)

      if (currentAuth.role === 'STUDENT') {
        const [profile, statement] = await Promise.all([
          api.studentProfile(currentAuth.token),
          api.studentStatement(currentAuth.token),
        ])

        setStudentProfile(profile)
        setStudentStatement(statement)
        setStudentUpdateForm({
          name: profile.name,
          address: profile.address,
          course: profile.course,
          password: '',
        })
      }

      if (currentAuth.role === 'PROFESSOR') {
        const [profile, statement, studentList] = await Promise.all([
          api.professorProfile(currentAuth.token),
          api.professorStatement(currentAuth.token),
          api.listStudents(currentAuth.token),
        ])

        setProfessorProfile(profile)
        setProfessorStatement(statement)
        setStudents(studentList)

        setTransferForm((current) => {
          if (current.studentId || studentList.length === 0) {
            return current
          }

          return { ...current, studentId: studentList[0].id }
        })
      }

      if (currentAuth.role === 'PARTNER') {
        const [profile, benefits] = await Promise.all([
          api.partnerProfile(currentAuth.token),
          api.listOwnBenefits(currentAuth.token),
        ])

        setPartnerProfile(profile)
        setPartnerBenefits(benefits)
        setPartnerUpdateForm({
          companyName: profile.companyName,
          contactName: profile.contactName,
          address: profile.address,
          password: '',
        })
      }
    } catch (error) {
      clearAuth()
      setStatus('error', `Sessao invalida: ${toErrorMessage(error)}`)
      navigate('/acesso', { replace: true })
    }
  }

  function resetPrivateState() {
    setDashboard(null)
    setStudentProfile(null)
    setStudentStatement(null)
    setProfessorProfile(null)
    setProfessorStatement(null)
    setStudents([])
    setPartnerProfile(null)
    setPartnerBenefits([])
  }

  function setStatus(tone: StatusTone, message: string) {
    if (tone === 'error') {
      console.error(message)
      return
    }

    console.info(message)
  }

  function saveAuth(nextAuth: AuthState) {
    setAuth(nextAuth)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
  }

  function clearAuth() {
    setAuth(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  function handleShellMove(event: MouseEvent<HTMLDivElement>) {
    const target = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - target.left) / target.width) * 100
    const y = ((event.clientY - target.top) / target.height) * 100
    setSpotlight({ x, y })
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsBusy(true)

    try {
      const response = await api.login(loginForm.login, loginForm.password, loginForm.role)
      saveAuth({
        token: response.token,
        role: response.role,
        userId: response.userId,
        displayName: response.displayName,
      })

      setLoginForm({
        login: '',
        password: '',
        role: loginForm.role,
      })

      setStatus('success', `Acesso liberado para ${response.displayName}.`)
      navigate(pathForRole(response.role), { replace: true })
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleLogout() {
    setIsBusy(true)

    try {
      await api.logout(auth?.token ?? null)
    } catch {
      // Keep local logout even if remote endpoint fails.
    } finally {
      clearAuth()
      await refreshPublicData()
      setStatus('info', 'Sessao encerrada com sucesso.')
      navigate('/acesso', { replace: true })
      setIsBusy(false)
    }
  }

  async function handleStudentRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsBusy(true)

    try {
      const student = await api.registerStudent(studentRegisterForm)
      setStudentRegisterForm({
        name: '',
        email: '',
        cpf: '',
        rg: '',
        address: '',
        institutionId: institutions[0]?.id ?? '',
        course: '',
        password: '',
      })

      setStatus('success', `Aluno ${student.name} cadastrado.`)
      navigate('/acesso')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handlePartnerRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsBusy(true)

    try {
      const partner = await api.registerPartner(partnerRegisterForm)
      setPartnerRegisterForm({
        companyName: '',
        contactName: '',
        email: '',
        cnpj: '',
        address: '',
        password: '',
      })

      setStatus('success', `Parceiro ${partner.companyName} cadastrado.`)
      navigate('/acesso')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleStudentUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) {
      return
    }

    setIsBusy(true)

    try {
      await api.updateStudent(auth.token, studentUpdateForm)
      await refreshPrivateData(auth)
      setStudentUpdateForm((current) => ({ ...current, password: '' }))
      setStatus('success', 'Perfil do aluno atualizado.')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleStudentDelete() {
    if (!auth) {
      return
    }

    if (!window.confirm('Confirma a exclusao da conta de aluno?')) {
      return
    }

    setIsBusy(true)

    try {
      await api.deleteStudent(auth.token)
      clearAuth()
      await refreshPublicData()
      setStatus('info', 'Conta de aluno removida.')
      navigate('/')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleRedeemBenefit() {
    if (!auth || !selectedBenefitId) {
      return
    }

    setIsBusy(true)

    try {
      const redemption = await api.redeemBenefit(auth.token, selectedBenefitId)
      await Promise.all([refreshPrivateData(auth), refreshPublicData()])
      setStatus('success', `Cupom gerado: ${redemption.couponCode}`)
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) {
      return
    }

    setIsBusy(true)

    try {
      await api.transferCoins(auth.token, transferForm)
      await refreshPrivateData(auth)
      setTransferForm((current) => ({
        ...current,
        amount: 1,
        message: '',
      }))
      setStatus('success', 'Transferencia registrada.')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handlePartnerUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) {
      return
    }

    setIsBusy(true)

    try {
      await api.updatePartner(auth.token, partnerUpdateForm)
      await refreshPrivateData(auth)
      setPartnerUpdateForm((current) => ({ ...current, password: '' }))
      setStatus('success', 'Perfil do parceiro atualizado.')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handlePartnerDelete() {
    if (!auth) {
      return
    }

    if (!window.confirm('Confirma a exclusao da conta de parceiro?')) {
      return
    }

    setIsBusy(true)

    try {
      await api.deletePartner(auth.token)
      clearAuth()
      await refreshPublicData()
      setStatus('info', 'Conta de parceiro removida.')
      navigate('/')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleBenefitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) {
      return
    }

    setIsBusy(true)

    try {
      await api.createBenefit(auth.token, benefitCreateForm)
      await Promise.all([refreshPrivateData(auth), refreshPublicData()])
      setBenefitCreateForm({
        title: '',
        description: '',
        imageUrl: '',
        costCoins: 100,
      })
      setStatus('success', 'Vantagem publicada no catalogo.')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleBenefitToggle(benefit: Benefit) {
    if (!auth) {
      return
    }

    setIsBusy(true)

    try {
      await api.updateBenefit(auth.token, benefit.id, {
        active: !benefit.active,
      })
      await Promise.all([refreshPrivateData(auth), refreshPublicData()])
      setStatus('success', 'Status da vantagem atualizado.')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleBenefitDelete(benefitId: string) {
    if (!auth) {
      return
    }

    if (!window.confirm('Remover esta vantagem do catalogo?')) {
      return
    }

    setIsBusy(true)

    try {
      await api.deleteBenefit(auth.token, benefitId)
      await Promise.all([refreshPrivateData(auth), refreshPublicData()])
      setStatus('info', 'Vantagem removida.')
    } catch (error) {
      setStatus('error', toErrorMessage(error))
    } finally {
      setIsBusy(false)
    }
  }

  function renderPublic(mode: PublicMode) {
    return (
      <PublicExperience
        mode={mode}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        studentRegisterForm={studentRegisterForm}
        setStudentRegisterForm={setStudentRegisterForm}
        partnerRegisterForm={partnerRegisterForm}
        setPartnerRegisterForm={setPartnerRegisterForm}
        institutions={institutions}
        publicBenefits={publicBenefits}
        isBusy={isBusy}
        onLogin={handleLogin}
        onStudentRegister={handleStudentRegister}
        onPartnerRegister={handlePartnerRegister}
      />
    )
  }

  function renderPortalHeader(role: Role) {
    return (
      <section className="portal-banner">
        <div>
          <p className="eyebrow">Painel privado</p>
          <h2>{titleForRole(role)}</h2>
          <p className="muted">Usuario atual: {dashboard?.displayName ?? auth?.displayName ?? 'Carregando...'}</p>
        </div>

        <div className="portal-kpi">
          <article>
            <span>Saldo</span>
            <strong>{dashboard?.balance ?? 0}</strong>
          </article>
          <article>
            <span>Transacoes</span>
            <strong>{dashboard?.totalTransactions ?? 0}</strong>
          </article>
          <article>
            <span>Vantagens</span>
            <strong>{dashboard?.totalBenefits ?? 0}</strong>
          </article>
        </div>
      </section>
    )
  }

  function renderPortalNavigation() {
    if (!auth) {
      return null
    }

    return (
      <aside className="portal-dock" aria-label="Navegacao do portal">
        <NavLink to={pathForRole(auth.role)} className={({ isActive }) => (isActive ? 'active' : '')}>
          Visao principal
        </NavLink>
        <NavLink to="/vitrine" end>
          Vitrine publica
        </NavLink>
        <button className="dock-logout" type="button" onClick={handleLogout} disabled={isBusy}>
          Encerrar sessao
        </button>
      </aside>
    )
  }

  return (
    <div className="prism-shell" onMouseMove={handleShellMove} style={shellStyle}>
      <div className="ambient-noise" aria-hidden="true" />
      <div className="ambient-wave wave-a" aria-hidden="true" />
      <div className="ambient-wave wave-b" aria-hidden="true" />

      <header className="prism-header">
        <div className="brand-cluster">
          <p className="eyebrow">Sistema de reconhecimento academico</p>
          <h1>Moeda Estudantil</h1>
        </div>

        <nav className="header-links" aria-label="Navegacao principal">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Showcase
          </Link>
          <Link to="/vitrine" className={location.pathname === '/vitrine' ? 'active' : ''}>
            Vitrine
          </Link>
          <Link to="/acesso" className={location.pathname === '/acesso' ? 'active' : ''}>
            Acesso
          </Link>
          <Link to="/cadastro/aluno" className={location.pathname === '/cadastro/aluno' ? 'active' : ''}>
            Novo aluno
          </Link>
          <Link to="/cadastro/parceiro" className={location.pathname === '/cadastro/parceiro' ? 'active' : ''}>
            Novo parceiro
          </Link>
          {auth ? (
            <Link to={pathForRole(auth.role)} className={location.pathname.startsWith('/portal') ? 'active' : ''}>
              Meu portal
            </Link>
          ) : null}
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="route-stage"
          initial={{ opacity: 0, y: 10, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.995 }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
        >
          <Routes location={location}>
            <Route path="/" element={renderPublic('landing')} />
            <Route path="/vitrine" element={<ProductShowcasePage benefits={publicBenefits} />} />
            <Route path="/acesso" element={auth ? <Navigate to={pathForRole(auth.role)} replace /> : renderPublic('login')} />
            <Route
              path="/cadastro/aluno"
              element={auth ? <Navigate to={pathForRole(auth.role)} replace /> : renderPublic('student-register')}
            />
            <Route
              path="/cadastro/parceiro"
              element={auth ? <Navigate to={pathForRole(auth.role)} replace /> : renderPublic('partner-register')}
            />

            <Route
              path="/portal"
              element={auth ? <Navigate to={pathForRole(auth.role)} replace /> : <Navigate to="/acesso" replace />}
            />

            <Route
              path="/portal/aluno"
              element={
                !auth ? (
                  <Navigate to="/acesso" replace />
                ) : auth.role !== 'STUDENT' ? (
                  <Navigate to={pathForRole(auth.role)} replace />
                ) : !studentProfile || !studentStatement ? (
                  <LoadingPanel label="Sincronizando mesa do aluno" />
                ) : (
                  <div className="portal-layout">
                    {renderPortalNavigation()}
                    <section className="portal-main">
                      {renderPortalHeader('STUDENT')}
                      <StudentWorkspace
                        profile={studentProfile}
                        statement={studentStatement}
                        form={studentUpdateForm}
                        setForm={setStudentUpdateForm}
                        publicBenefits={publicBenefits}
                        selectedBenefitId={selectedBenefitId}
                        setSelectedBenefitId={setSelectedBenefitId}
                        isBusy={isBusy}
                        onUpdate={handleStudentUpdate}
                        onDelete={handleStudentDelete}
                        onRedeem={handleRedeemBenefit}
                        dateFormatter={dateFormatter}
                      />
                    </section>
                  </div>
                )
              }
            />

            <Route
              path="/portal/professor"
              element={
                !auth ? (
                  <Navigate to="/acesso" replace />
                ) : auth.role !== 'PROFESSOR' ? (
                  <Navigate to={pathForRole(auth.role)} replace />
                ) : !professorProfile || !professorStatement ? (
                  <LoadingPanel label="Sincronizando mesa do professor" />
                ) : (
                  <div className="portal-layout">
                    {renderPortalNavigation()}
                    <section className="portal-main">
                      {renderPortalHeader('PROFESSOR')}
                      <ProfessorWorkspace
                        profile={professorProfile}
                        statement={professorStatement}
                        students={students}
                        transfer={transferForm}
                        setTransfer={setTransferForm}
                        isBusy={isBusy}
                        onTransfer={handleTransfer}
                        dateFormatter={dateFormatter}
                      />
                    </section>
                  </div>
                )
              }
            />

            <Route
              path="/portal/parceiro"
              element={
                !auth ? (
                  <Navigate to="/acesso" replace />
                ) : auth.role !== 'PARTNER' ? (
                  <Navigate to={pathForRole(auth.role)} replace />
                ) : !partnerProfile ? (
                  <LoadingPanel label="Sincronizando mesa do parceiro" />
                ) : (
                  <div className="portal-layout">
                    {renderPortalNavigation()}
                    <section className="portal-main">
                      {renderPortalHeader('PARTNER')}
                      <PartnerWorkspace
                        profile={partnerProfile}
                        updateForm={partnerUpdateForm}
                        setUpdateForm={setPartnerUpdateForm}
                        createForm={benefitCreateForm}
                        setCreateForm={setBenefitCreateForm}
                        partnerBenefits={partnerBenefits}
                        isBusy={isBusy}
                        onUpdate={handlePartnerUpdate}
                        onDelete={handlePartnerDelete}
                        onCreateBenefit={handleBenefitCreate}
                        onToggleBenefit={handleBenefitToggle}
                        onDeleteBenefit={handleBenefitDelete}
                      />
                    </section>
                  </div>
                )
              }
            />

            <Route path="*" element={<Navigate to={auth ? pathForRole(auth.role) : '/'} replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <section className="loading-panel" role="status" aria-live="polite">
      <span className="loading-ring" aria-hidden="true" />
      <p>{label}</p>
    </section>
  )
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Falha inesperada ao executar a operacao.'
}

export default App
