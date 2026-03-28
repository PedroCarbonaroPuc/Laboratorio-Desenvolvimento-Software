import { useEffect, useState } from 'react';
import { ordersApi } from '../../api/orders.api';
import { RentalOrder, OrderStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import { ClipboardList, Search, CheckCircle, XCircle, FileSearch } from 'lucide-react';

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);
  const [analysisNotes, setAnalysisNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersApi.getAll();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleAnalyze = async (orderId: string, approved: boolean) => {
    setProcessing(true);
    try {
      await ordersApi.analyze(orderId, { approved, notes: analysisNotes });
      setSelectedOrder(null);
      setAnalysisNotes('');
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao processar análise');
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async (orderId: string) => {
    setProcessing(true);
    try {
      await ordersApi.approve(orderId);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao aprovar pedido');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (orderId: string) => {
    setProcessing(true);
    try {
      await ordersApi.reject(orderId);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao rejeitar pedido');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = orders
    .filter((o) => filter === 'ALL' || o.status === filter)
    .filter(
      (o) =>
        o.clientName.toLowerCase().includes(search.toLowerCase()) ||
        o.vehicleDescription.toLowerCase().includes(search.toLowerCase()),
    );

  if (loading) return <Loading />;

  const statuses: (OrderStatus | 'ALL')[] = [
    'ALL', 'PENDING', 'UNDER_ANALYSIS', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED',
  ];
  const statusLabels: Record<string, string> = {
    ALL: 'Todos', PENDING: 'Pendentes', UNDER_ANALYSIS: 'Em Análise',
    APPROVED: 'Aprovados', REJECTED: 'Rejeitados', CANCELLED: 'Cancelados', COMPLETED: 'Concluídos',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Gestão de Pedidos</h1>
          <p className="text-primary-500 dark:text-primary-400 mt-1">Avalie e gerencie pedidos de aluguel</p>
        </div>
        <div className="relative mt-4 sm:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            className="input-field pl-11 w-full sm:w-72"
            placeholder="Buscar cliente ou veículo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
          <ClipboardList className="w-12 h-12 text-primary-300 mx-auto mb-4" />
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
                    <Badge status={order.status} />
                  </div>
                  <div className="text-sm text-primary-500 dark:text-primary-400 space-y-1">
                    <span>Cliente: <strong>{order.clientName}</strong></span>
                    <span>Período: {formatDate(order.startDate)} — {formatDate(order.endDate)}</span>
                    <span className="font-semibold text-primary-900">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedOrder(order); setAnalysisNotes(''); }}
                    className="btn-outline flex items-center gap-2 text-sm py-2"
                  >
                    <FileSearch className="w-4 h-4" /> Avaliar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Avaliação do Pedido"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-primary-50 dark:bg-primary-700 rounded-lg p-4">
              <h4 className="font-semibold text-primary-900 dark:text-white">{selectedOrder.vehicleDescription}</h4>
              <p className="text-sm text-primary-500 dark:text-primary-400 mt-1">
                Cliente: {selectedOrder.clientName}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-primary-500">Período</span>
                  <p className="font-medium">{formatDate(selectedOrder.startDate)} — {formatDate(selectedOrder.endDate)}</p>
                </div>
                <div>
                  <span className="text-primary-500">Valor Total</span>
                  <p className="font-bold text-accent">{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge status={selectedOrder.status} />
            </div>

            {selectedOrder.financialAnalysis && (
              <div className="bg-primary-50 dark:bg-primary-700 rounded-lg p-4">
                <h4 className="font-medium text-primary-900 dark:text-white mb-2">Análise Já Realizada</h4>
                <p className="text-sm">
                  Parecer: {' '}
                  <span className={selectedOrder.financialAnalysis.approved ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                    {selectedOrder.financialAnalysis.approved ? 'Positivo' : 'Negativo'}
                  </span>
                </p>
                {selectedOrder.financialAnalysis.notes && (
                  <p className="text-sm text-primary-600 mt-1">{selectedOrder.financialAnalysis.notes}</p>
                )}
              </div>
            )}

            {selectedOrder.status === 'PENDING' && (
              <>
                <div>
                  <label className="label">Observações da análise financeira</label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Insira suas observações..."
                    value={analysisNotes}
                    onChange={(e) => setAnalysisNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAnalyze(selectedOrder.id, false)}
                    disabled={processing}
                    className="btn-danger flex-1 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Reprovar
                  </button>
                  <button
                    onClick={() => handleAnalyze(selectedOrder.id, true)}
                    disabled={processing}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Aprovar Análise
                  </button>
                </div>
              </>
            )}

            {selectedOrder.status === 'UNDER_ANALYSIS' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleReject(selectedOrder.id)}
                  disabled={processing}
                  className="btn-danger flex-1 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Rejeitar
                </button>
                <button
                  onClick={() => handleApprove(selectedOrder.id)}
                  disabled={processing}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Aprovar Contrato
                </button>
              </div>
            )}

            {!['PENDING', 'UNDER_ANALYSIS'].includes(selectedOrder.status) && (
              <button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full">
                Fechar
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
