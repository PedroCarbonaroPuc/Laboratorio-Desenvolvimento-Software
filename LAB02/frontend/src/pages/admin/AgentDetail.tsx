import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { AdminAgentDetail as AdminAgentDetailType } from '../../types';
import { formatCurrency, formatDate, formatDateTime, getStatusLabel, getStatusColor } from '../../utils/formatters';
import { ArrowLeft, Building2, Mail, MapPin, Phone, CarFront, FileText } from 'lucide-react';
import Loading from '../../components/common/Loading';
import { maskCnpj, maskPhone } from '../../utils/masks';

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminAgentDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getAgentDetail(id!);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading || !data) return <Loading />;

  const { agent, vehicles, orders } = data;

  const availableVehicles = vehicles.filter((v) => v.available).length;
  const totalRevenue = orders
    .filter((o) => ['APPROVED', 'ACTIVE', 'COMPLETED'].includes(o.status))
    .reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 text-primary-400 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Detalhes do Agente</h1>
          <p className="text-primary-500 dark:text-primary-400 mt-1">{agent.companyName}</p>
        </div>
      </div>

      {/* Agent Info + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
            Informações da Empresa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">Razão Social</span>
              <p className="text-primary-900 font-medium mt-1">{agent.companyName}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">E-mail</span>
              <p className="text-primary-900 mt-1 flex items-center gap-1">
                <Mail className="w-4 h-4 text-primary-400" />
                {agent.email}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">CNPJ</span>
              <p className="text-primary-900 font-mono mt-1">{maskCnpj(agent.cnpj)}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">Telefone</span>
              <p className="text-primary-900 mt-1 flex items-center gap-1">
                <Phone className="w-4 h-4 text-primary-400" />
                {maskPhone(agent.phone)}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">Cadastro</span>
              <p className="text-primary-900 mt-1">{formatDateTime(agent.createdAt)}</p>
            </div>
          </div>

          {/* Address */}
          {agent.address && (
            <div className="mt-6 pt-4 border-t border-primary-200">
              <h3 className="text-sm font-semibold text-primary-700 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-accent" />
                Endereço
              </h3>
              <p className="text-primary-600">
                {agent.address.street}, {agent.address.number}
                {agent.address.complement && ` - ${agent.address.complement}`}
              </p>
              <p className="text-primary-600">
                {agent.address.neighborhood} — {agent.address.city}/{agent.address.state}
              </p>
              <p className="text-primary-500 text-sm font-mono">CEP: {agent.address.zipCode}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">Receita Total</h3>
            <p className="text-3xl font-bold text-accent">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">Total de Veículos</h3>
            <p className="text-3xl font-bold text-primary-900">{vehicles.length}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">Veículos Disponíveis</h3>
            <p className="text-3xl font-bold text-success">{availableVehicles}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">Total de Pedidos</h3>
            <p className="text-3xl font-bold text-primary-600">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card mb-8">
        <div className="p-6 border-b border-primary-200">
          <h2 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
            <CarFront className="w-5 h-5 text-accent" />
            Veículos Cadastrados
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-200">
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Veículo</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Placa</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Ano</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Diária</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-primary-400">
                    Nenhum veículo cadastrado
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-primary-100 hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary-900">{v.brand} {v.model}</td>
                    <td className="px-6 py-4 text-primary-600 font-mono">{v.licensePlate}</td>
                    <td className="px-6 py-4 text-primary-600">{v.year}</td>
                    <td className="px-6 py-4 font-semibold text-primary-900">{formatCurrency(v.dailyRate)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          v.available
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {v.available ? 'Disponível' : 'Alugado'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="p-6 border-b border-primary-200">
          <h2 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Pedidos de Aluguel
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-200">
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Veículo</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Período</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Valor</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-primary-400">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-primary-100 hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary-900">{order.clientName}</td>
                    <td className="px-6 py-4 font-racing text-primary-600">{order.vehicleDescription}</td>
                    <td className="px-6 py-4 text-primary-600 text-sm">
                      {formatDate(order.startDate)} — {formatDate(order.endDate)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
