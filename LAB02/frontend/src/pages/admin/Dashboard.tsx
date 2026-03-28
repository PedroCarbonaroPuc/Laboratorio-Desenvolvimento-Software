import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { AdminDashboard as AdminDashboardType, UserSummary } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { Users, CarFront, FileText, Activity, Trash2, Search, Eye } from 'lucide-react';
import Loading from '../../components/common/Loading';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CLIENT' | 'AGENT'>('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const res = await adminApi.getDashboard();
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      await adminApi.deleteUser(userId);
      setDeleteConfirm(null);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetail = (user: UserSummary) => {
    if (user.role === 'CLIENT') {
      navigate(`/admin/clients/${user.id}`);
    } else {
      navigate(`/admin/agents/${user.id}`);
    }
  };

  if (loading || !dashboard) return <Loading />;

  const filteredUsers = dashboard.users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Clientes', value: dashboard.totalClients, icon: Users, color: 'bg-accent/10 text-accent' },
    { label: 'Agentes', value: dashboard.totalAgents, icon: Users, color: 'bg-success/10 text-success' },
    { label: 'Veículos', value: dashboard.totalVehicles, icon: CarFront, color: 'bg-primary-100 text-primary-600' },
    { label: 'Pedidos', value: dashboard.totalOrders, icon: FileText, color: 'bg-warning/10 text-warning' },
    { label: 'Pedidos Ativos', value: dashboard.activeOrders, icon: Activity, color: 'bg-danger/10 text-danger' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Painel Administrativo</h1>
        <p className="text-primary-500 dark:text-primary-400 mt-1">Visão geral do sistema RentaCar</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-500 dark:text-primary-400">{stat.label}</p>
                <p className="text-3xl font-bold text-primary-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User List */}
      <div className="card">
        <div className="p-6 border-b border-primary-200 dark:border-primary-700">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-4">Usuários Cadastrados</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'CLIENT' | 'AGENT')}
              className="input-field w-full sm:w-48"
            >
              <option value="ALL">Todos os tipos</option>
              <option value="CLIENT">Clientes</option>
              <option value="AGENT">Agentes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-200 dark:border-primary-700">
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">
                  Nome
                </th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">
                  E-mail
                </th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">
                  Tipo
                </th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">
                  Cadastro
                </th>
                <th className="text-right text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-primary-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-primary-100 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-primary-900 dark:text-white">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-primary-600 dark:text-primary-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'CLIENT'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-success/10 text-success'
                        }`}
                      >
                        {user.role === 'CLIENT' ? 'Cliente' : 'Agente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-500">
                      {formatDateTime(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(user)}
                          className="p-2 text-primary-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {deleteConfirm === user.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-xs px-2 py-1 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs px-2 py-1 bg-primary-200 text-primary-700 rounded-md hover:bg-primary-300 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className="p-2 text-primary-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-colors"
                            title="Excluir usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-primary-200 dark:border-primary-700 text-sm text-primary-500 dark:text-primary-400">
          {filteredUsers.length} usuário(s) encontrado(s)
        </div>
      </div>
    </div>
  );
}
