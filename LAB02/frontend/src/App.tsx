import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ClientDashboard from './pages/client/Dashboard';
import VehicleList from './pages/client/VehicleList';
import MyOrders from './pages/client/MyOrders';
import AgentDashboard from './pages/agent/Dashboard';
import OrderManagement from './pages/agent/OrderManagement';
import VehicleManagement from './pages/agent/VehicleManagement';
import AdminDashboard from './pages/admin/Dashboard';
import AdminClientDetail from './pages/admin/ClientDetail';
import AdminAgentDetail from './pages/admin/AgentDetail';
import LoadTests from './pages/admin/LoadTests';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'ADMIN': return <Navigate to="/admin/users" replace />;
    case 'AGENT': return <Navigate to="/agent/dashboard" replace />;
    default: return <Navigate to="/client/dashboard" replace />;
  }
}

function RoleGuard({ role, children }: { role: string; children: React.ReactElement }) {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<AppLayout />}>
            {/* Client routes */}
            <Route path="/client/dashboard" element={<RoleGuard role="CLIENT"><ClientDashboard /></RoleGuard>} />
            <Route path="/client/vehicles" element={<RoleGuard role="CLIENT"><VehicleList /></RoleGuard>} />
            <Route path="/client/orders" element={<RoleGuard role="CLIENT"><MyOrders /></RoleGuard>} />

            {/* Agent routes */}
            <Route path="/agent/dashboard" element={<RoleGuard role="AGENT"><AgentDashboard /></RoleGuard>} />
            <Route path="/agent/orders" element={<RoleGuard role="AGENT"><OrderManagement /></RoleGuard>} />
            <Route path="/agent/vehicles" element={<RoleGuard role="AGENT"><VehicleManagement /></RoleGuard>} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin/users" replace />} />
            <Route path="/admin/users" element={<RoleGuard role="ADMIN"><AdminDashboard /></RoleGuard>} />
            <Route path="/admin/clients/:id" element={<RoleGuard role="ADMIN"><AdminClientDetail /></RoleGuard>} />
            <Route path="/admin/agents/:id" element={<RoleGuard role="ADMIN"><AdminAgentDetail /></RoleGuard>} />
            <Route path="/admin/load-tests" element={<RoleGuard role="ADMIN"><LoadTests /></RoleGuard>} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<RoleRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
