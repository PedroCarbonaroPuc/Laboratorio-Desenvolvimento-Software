import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import RegisterAluno from './pages/RegisterAluno'
import RegisterEmpresa from './pages/RegisterEmpresa'
import Dashboard from './pages/Dashboard'
import AlunosCrud from './pages/AlunosCrud'
import EmpresasCrud from './pages/EmpresasCrud'
import EnviarMoedas from './pages/EnviarMoedas'
import Extrato from './pages/Extrato'
import Vantagens from './pages/Vantagens'
import MinhasVantagens from './pages/MinhasVantagens'
import Resgates from './pages/Resgates'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro/aluno" element={<RegisterAluno />} />
      <Route path="/cadastro/empresa" element={<RegisterEmpresa />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route element={<ProtectedRoute allowedRoles={['PROFESSOR']} />}>
            <Route path="/alunos" element={<AlunosCrud />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['EMPRESA']} />}>
            <Route path="/empresas" element={<EmpresasCrud />} />
          </Route>
          <Route path="/enviar-moedas" element={<EnviarMoedas />} />
          <Route path="/extrato" element={<Extrato />} />
          <Route path="/vantagens" element={<Vantagens />} />
          <Route path="/minhas-vantagens" element={<MinhasVantagens />} />
          <Route path="/resgates" element={<Resgates />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
