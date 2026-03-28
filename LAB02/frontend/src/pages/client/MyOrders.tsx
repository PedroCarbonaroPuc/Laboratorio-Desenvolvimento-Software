import { useEffect, useState } from 'react';
import { ordersApi } from '../../api/orders.api';
import { RentalOrder, OrderStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import { FileText, Eye, XCircle } from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) return;
    setCancelling(true);
    try {
      await ordersApi.cancel(orderId);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao cancelar pedido');
    } finally {
      setCancelling(false);
    }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loading />;

  const statuses: (OrderStatus | 'ALL')[] = [
    'ALL', 'PENDING', 'UNDER_ANALYSIS', 'APPROVED', 'REJECTED', 'CANCELLED',
  ];
  const statusLabels: Record<string, string> = {
    ALL: 'Todos', PENDING: 'Pendentes', UNDER_ANALYSIS: 'Em Análise',
    APPROVED: 'Aprovados', REJECTED: 'Rejeitados', CANCELLED: 'Cancelados',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Meus Pedidos</h1>
        <p className="text-primary-500 dark:text-primary-400 mt-1">Acompanhe o status dos seus pedidos de aluguel</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-accent text-white'
                : 'bg-white dark:bg-primary-800 text-primary-600 dark:text-primary-300 border border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-700'
            }`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 text-primary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary-700 dark:text-primary-300">Nenhum pedido encontrado</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-primary-900 dark:text-white">{order.vehicleDescription}</h3>
                    <span>Período: {formatDate(order.startDate)} — {formatDate(order.endDate)}</span>
                    <span>{order.rentalDays} dias</span>
                    <span className="font-semibold text-primary-900">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="btn-outline flex items-center gap-2 text-sm py-2"
                  >
                    <Eye className="w-4 h-4" /> Detalhes
                  </button>
                  {(order.status === 'PENDING' || order.status === 'UNDER_ANALYSIS') && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="btn-danger flex items-center gap-2 text-sm py-2"
                    >
                      <XCircle className="w-4 h-4" /> Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Detalhes do Pedido"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg text-primary-900 dark:text-white">{selectedOrder.vehicleDescription}</h3>
              <Badge status={selectedOrder.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-primary-500 dark:text-primary-400">Data Início</span>
                <p className="font-semibold">{formatDate(selectedOrder.startDate)}</p>
              </div>
              <div>
                <span className="text-primary-500 dark:text-primary-400">Data Término</span>
                <p className="font-semibold">{formatDate(selectedOrder.endDate)}</p>
              </div>
              <div>
                <span className="text-primary-500 dark:text-primary-400">Dias de Aluguel</span>
                <p className="font-semibold">{selectedOrder.rentalDays}</p>
              </div>
              <div>
                <span className="text-primary-500 dark:text-primary-400">Valor Total</span>
                <p className="font-bold text-accent">{formatCurrency(selectedOrder.totalAmount)}</p>
              </div>
            </div>

            {selectedOrder.financialAnalysis && (
              <div className="bg-primary-50 dark:bg-primary-700 rounded-lg p-4">
                <h4 className="font-medium text-primary-900 dark:text-white mb-2">Análise Financeira</h4>
                <p className="text-sm">
                  <span className="text-primary-500">Parecer: </span>
                  <span className={selectedOrder.financialAnalysis.approved ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                    {selectedOrder.financialAnalysis.approved ? 'Aprovado' : 'Rejeitado'}
                  </span>
                </p>
                {selectedOrder.financialAnalysis.notes && (
                  <p className="text-sm text-primary-600 mt-1">
                    Observações: {selectedOrder.financialAnalysis.notes}
                  </p>
                )}
              </div>
            )}

            <button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full">
              Fechar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
