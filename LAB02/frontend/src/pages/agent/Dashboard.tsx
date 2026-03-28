import { useEffect, useState } from 'react';
import { ordersApi } from '../../api/orders.api';
import { vehiclesApi } from '../../api/vehicles.api';
import { RentalOrder, Vehicle } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ClipboardList, CarFront, Clock, CheckCircle } from 'lucide-react';
import Loading from '../../components/common/Loading';

export default function AgentDashboard() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, vehiclesRes] = await Promise.all([
          ordersApi.getAll(),
          vehiclesApi.getAll(),
        ]);
        setOrders(ordersRes.data);
        setVehicles(vehiclesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  const pending = orders.filter((o) => o.status === 'PENDING').length;
  const underAnalysis = orders.filter((o) => o.status === 'UNDER_ANALYSIS').length;
  const approved = orders.filter((o) => ['APPROVED', 'ACTIVE', 'COMPLETED'].includes(o.status)).length;
  const totalRevenue = orders
    .filter((o) => ['APPROVED', 'ACTIVE', 'COMPLETED'].includes(o.status))
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const stats = [
    { label: 'Pedidos Pendentes', value: pending, icon: Clock, color: 'bg-warning/10 text-warning' },
    { label: 'Em Análise', value: underAnalysis, icon: ClipboardList, color: 'bg-accent/10 text-accent' },
    { label: 'Aprovados', value: approved, icon: CheckCircle, color: 'bg-success/10 text-success' },
    { label: 'Veículos Cadastrados', value: vehicles.length, icon: CarFront, color: 'bg-primary-100 text-primary-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Dashboard do Agente</h1>
        <p className="text-primary-500 dark:text-primary-400 mt-1">Visão geral de pedidos e veículos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-1">Receita Total</h2>
          <p className="text-sm text-primary-500 dark:text-primary-400 mb-4">Pedidos aprovados e concluídos</p>
          <div className="text-4xl font-bold text-accent">{formatCurrency(totalRevenue)}</div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-1">Total de Pedidos</h2>
          <p className="text-sm text-primary-500 dark:text-primary-400 mb-4">Todos os pedidos no sistema</p>
          <div className="text-4xl font-bold text-primary-900 dark:text-white">{orders.length}</div>
        </div>
      </div>
    </div>
  );
}
