import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { AdminClientDetail as AdminClientDetailType } from '../../types';
import { formatCurrency, formatDate, formatDateTime, formatCpf, getStatusLabel, getStatusColor } from '../../utils/formatters';
import { ArrowLeft, User, Mail, FileText, MapPin, Briefcase, DollarSign } from 'lucide-react';
import Loading from '../../components/common/Loading';
import { maskCpf, maskRg } from '../../utils/masks';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminClientDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getClientDetail(id!);
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

  const { client, orders } = data;

  const activeOrders = orders.filter((o) => ['APPROVED', 'ACTIVE'].includes(o.status));
  const totalSpent = orders
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
          <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Detalhes do Cliente</h1>
          <p className="text-primary-500 dark:text-primary-400 mt-1">{client.name}</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
            Informações Pessoais
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">Nome</span>
              <p className="text-primary-900 font-medium mt-1">{client.name}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">E-mail</span>
              <p className="text-primary-900 mt-1 flex items-center gap-1">
                <Mail className="w-4 h-4 text-primary-400" />
                {client.email}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">CPF</span>
              <p className="text-primary-900 font-mono mt-1">{maskCpf(client.cpf)}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">RG</span>
              <p className="text-primary-900 font-mono mt-1">{maskRg(client.rg)}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">Profissão</span>
              <p className="text-primary-900 mt-1 flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-primary-400" />
                {client.profession}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">Cadastro</span>
              <p className="text-primary-900 mt-1">{formatDateTime(client.createdAt)}</p>
            </div>
          </div>

          {/* Address */}
          {client.address && (
            <div className="mt-6 pt-4 border-t border-primary-200 dark:border-primary-700">
              <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2 flex items-center gap-1">
                Endereço
              </h3>
              <p className="text-primary-600">
                {client.address.street}, {client.address.number}
                {client.address.complement && ` - ${client.address.complement}`}
              </p>
              <p className="text-primary-600">
                {client.address.neighborhood} — {client.address.city}/{client.address.state}
              </p>
              <p className="text-primary-500 text-sm font-mono">CEP: {client.address.zipCode}</p>
            </div>
          )}

          {/* Employers */}
          {client.employers && client.employers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-primary-200 dark:border-primary-700">
              <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-accent" />
                Empregadores
              </h3>
              <div className="space-y-2">
                {client.employers.map((emp, i) => (
                  <div key={i} className="flex items-center justify-between bg-primary-50 dark:bg-primary-700 rounded-lg px-4 py-2">
                    <div>
                      <span className="font-medium text-primary-900 dark:text-white">{emp.name}</span>
                      <span className="text-sm text-primary-500 ml-2">{emp.phone}</span>
                    </div>
                    <span className="text-sm font-semibold text-accent">{formatCurrency(emp.income)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">Renda Total</h3>
            <p className="text-3xl font-bold text-accent">{formatCurrency(client.totalIncome)}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">Total em Aluguéis</h3>
            <p className="text-3xl font-bold text-primary-900">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">Pedidos Ativos</h3>
            <p className="text-3xl font-bold text-success">{activeOrders.length}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">Total de Pedidos</h3>
            <p className="text-3xl font-bold text-primary-600">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="p-6 border-b border-primary-200 dark:border-primary-700">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-white flex items-center gap-2">
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-200">
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Veículo</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Período</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Valor</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-primary-500 uppercase tracking-wider px-6 py-4">Criado em</th>
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
                    <td className="px-6 py-4 font-medium text-primary-900">{order.vehicleDescription}</td>
                    <td className="px-6 py-4 text-primary-600 text-sm">
                      {formatDate(order.startDate)} — {formatDate(order.endDate)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-500">{formatDateTime(order.createdAt)}</td>
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
