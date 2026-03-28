import { useEffect, useState } from 'react';
import { ordersApi } from '../../api/orders.api';
import { vehiclesApi } from '../../api/vehicles.api';
import { RentalOrder, Vehicle } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { FileText, CarFront, TrendingUp, Clock } from 'lucide-react';
import Loading from '../../components/common/Loading';

export default function ClientDashboard() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, vehiclesRes] = await Promise.all([
          ordersApi.getMyOrders(),
          vehiclesApi.getAvailable(),
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

  const totalSpent = orders
    .filter((o) => ['APPROVED', 'ACTIVE', 'COMPLETED'].includes(o.status))
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pending = orders.filter((o) => o.status === 'PENDING').length;
  const active = orders.filter((o) => ['APPROVED', 'ACTIVE'].includes(o.status)).length;

  const stats = [
    { label: 'Total de Pedidos', value: orders.length, icon: FileText, color: 'bg-accent/10 text-accent' },
    { label: 'Pedidos Pendentes', value: pending, icon: Clock, color: 'bg-warning/10 text-warning' },
    { label: 'Pedidos Ativos', value: active, icon: TrendingUp, color: 'bg-success/10 text-success' },
    { label: 'Veículos Disponíveis', value: vehicles.length, icon: CarFront, color: 'bg-primary-100 text-primary-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Dashboard</h1>
        <p className="text-primary-500 dark:text-primary-400 mt-1">Visão geral dos seus aluguéis</p>
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

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-1">Resumo Financeiro</h2>
        <p className="text-sm text-primary-500 dark:text-primary-400 mb-4">Total investido em aluguéis aprovados</p>
        <div className="text-4xl font-bold text-accent">{formatCurrency(totalSpent)}</div>
      </div>
    </div>
  );
}
