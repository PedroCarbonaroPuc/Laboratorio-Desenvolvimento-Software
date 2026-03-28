import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehiclesApi } from '../../api/vehicles.api';
import { ordersApi } from '../../api/orders.api';
import { Vehicle } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import { CarFront, Calendar, Search } from 'lucide-react';

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderError, setOrderError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    vehiclesApi.getAvailable().then((res) => {
      setVehicles(res.data);
      setFiltered(res.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      vehicles.filter(
        (v) =>
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.licensePlate.toLowerCase().includes(q),
      ),
    );
  }, [search, vehicles]);

  const handleOrder = async () => {
    if (!selectedVehicle || !startDate || !endDate) return;
    setOrderError('');
    setSubmitting(true);

    try {
      await ordersApi.create({ vehicleId: selectedVehicle.id, startDate, endDate });
      setSelectedVehicle(null);
      navigate('/client/orders');
    } catch (err: any) {
      setOrderError(err.response?.data?.error || 'Erro ao criar pedido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Veículos Disponíveis</h1>
          <p className="text-primary-500 dark:text-primary-400 mt-1">Escolha um veículo para alugar</p>
        </div>
        <div className="relative mt-4 sm:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            className="input-field pl-11 w-full sm:w-72"
            placeholder="Buscar marca, modelo ou placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <CarFront className="w-12 h-12 text-primary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary-700 dark:text-primary-300">Nenhum veículo encontrado</h3>
          <p className="text-primary-500 dark:text-primary-400 mt-1">Tente ajustar sua busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vehicle) => (
            <div key={vehicle.id} className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-br from-primary-800 to-primary-900 p-6">
                <CarFront className="w-12 h-12 text-accent mb-3" />
                <h3 className="text-white font-bold text-lg">{vehicle.brand} {vehicle.model}</h3>
                <p className="text-primary-300 text-sm font-mono">{vehicle.licensePlate}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-primary-500 dark:text-primary-400">Ano</span>
                    <p className="font-semibold text-primary-900 dark:text-white">{vehicle.year}</p>
                  </div>
                  <div>
                    <span className="text-primary-500 dark:text-primary-400">Matrícula</span>
                    <p className="font-semibold text-primary-900 dark:text-white font-mono">{vehicle.registrationNumber}</p>
                  </div>
                  <div>
                    <span className="text-primary-500 dark:text-primary-400">Propriedade</span>
                    <p className="font-semibold text-primary-900 dark:text-white">{vehicle.ownerType}</p>
                  </div>
                  <div>
                    <span className="text-primary-500">Diária</span>
                    <p className="font-bold text-accent text-lg">{formatCurrency(vehicle.dailyRate)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="btn-primary w-full"
                >
                  Solicitar Aluguel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedVehicle}
        onClose={() => { setSelectedVehicle(null); setOrderError(''); }}
        title="Novo Pedido de Aluguel"
      >
        {selectedVehicle && (
          <div className="space-y-4">
            <div className="bg-primary-50 dark:bg-primary-700 rounded-lg p-4">
              <p className="font-semibold text-primary-900 dark:text-white">
                {selectedVehicle.brand} {selectedVehicle.model}
              </p>
              <p className="text-sm text-primary-500">
                Placa: {selectedVehicle.licensePlate} — Diária: {formatCurrency(selectedVehicle.dailyRate)}
              </p>
            </div>

            {orderError && (
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                {orderError}
              </div>
            )}

            <div>
              <label className="label">Data de início</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input type="date" className="input-field pl-11" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label">Data de término</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input type="date" className="input-field pl-11" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setSelectedVehicle(null)} className="btn-secondary flex-1">
                Cancelar
              </button>
              <button onClick={handleOrder} disabled={submitting || !startDate || !endDate}
                className="btn-primary flex-1">
                {submitting ? 'Criando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
