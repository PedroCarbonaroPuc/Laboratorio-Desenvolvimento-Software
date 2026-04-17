import { useEffect, useState } from 'react';
import { vehiclesApi } from '../../api/vehicles.api';
import { Vehicle, OwnerType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Toast from '../../components/common/Toast';
import { CarFront, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { maskCurrency, unmaskCurrency, numberToCurrencyDisplay } from '../../utils/masks';
import { getCarImageUrl } from '../../utils/carImages';

interface VehicleFormData {
  registrationNumber: string;
  year: number;
  brand: string;
  model: string;
  licensePlate: string;
  ownerType: OwnerType;
  ownerId: string;
  dailyRate: number;
}

const emptyForm: VehicleFormData = {
  registrationNumber: '', year: new Date().getFullYear(), brand: '', model: '',
  licensePlate: '', ownerType: 'COMPANY', ownerId: '', dailyRate: 0,
};

export default function VehicleManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleFormData>({ ...emptyForm });
  const [dailyRateDisplay, setDailyRateDisplay] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '' });

  const fetchVehicles = async () => {
    try {
      const { data } = await vehiclesApi.getAll();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const filtered = vehicles.filter(
    (v) =>
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setForm({ ...emptyForm });
    setDailyRateDisplay('');
    setEditId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setForm({
      registrationNumber: vehicle.registrationNumber,
      year: vehicle.year,
      brand: vehicle.brand,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
      ownerType: vehicle.ownerType,
      ownerId: vehicle.ownerId || '',
      dailyRate: vehicle.dailyRate,
    });
    setDailyRateDisplay(numberToCurrencyDisplay(vehicle.dailyRate));
    setEditId(vehicle.id);
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setFormError('');
    setSubmitting(true);
    try {
      if (editId) {
        await vehiclesApi.update(editId, form as any);
      } else {
        await vehiclesApi.create(form as any);
      }
      setShowForm(false);
      fetchVehicles();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Erro ao salvar veículo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await vehiclesApi.delete(id);
      setDeleteVehicleId(null);
      fetchVehicles();
    } catch (err: any) {
      setDeleteVehicleId(null);
      setToast({ open: true, message: err.response?.data?.error || 'Erro ao remover veículo' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-racing text-primary-900 dark:text-white">Gestão de Veículos</h1>
          <p className="text-primary-500 dark:text-primary-400 mt-1">Cadastre e gerencie veículos disponíveis</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              className="input-field pl-11 w-full sm:w-60"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" /> Novo Veículo
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <CarFront className="w-12 h-12 text-primary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary-700 dark:text-primary-300">Nenhum veículo cadastrado</h3>
          <p className="text-primary-500 dark:text-primary-400 mt-1">Clique em "Novo Veículo" para começar</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-200 dark:border-primary-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Placa</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Ano</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Propriedade</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Diária</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-primary-100 dark:border-primary-800 hover:bg-primary-50/50 dark:hover:bg-primary-800/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 dark:bg-primary-800 rounded-lg w-16 h-12 overflow-hidden flex-shrink-0">
                        <img
                          src={getCarImageUrl(vehicle.brand, vehicle.model, vehicle.year)}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2M9 17h6"/></svg></div>';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-racing text-base text-primary-900 dark:text-white">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-xs text-primary-500 font-mono">{vehicle.registrationNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm font-medium">{vehicle.licensePlate}</td>
                  <td className="py-4 px-4 text-sm">{vehicle.year}</td>
                  <td className="py-4 px-4 text-sm">{vehicle.ownerType}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-accent">{formatCurrency(vehicle.dailyRate)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      vehicle.available ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {vehicle.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(vehicle)}
                        className="p-2 hover:bg-primary-100 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4 text-primary-500" />
                      </button>
                      <button onClick={() => setDeleteVehicleId(vehicle.id)}
                        className="p-2 hover:bg-danger/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? 'Editar Veículo' : 'Novo Veículo'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Marca</label>
              <input className="input-field" value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div>
              <label className="label">Modelo</label>
              <input className="input-field" value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Placa</label>
              <input className="input-field font-mono" value={form.licensePlate}
                onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} />
            </div>
            <div>
              <label className="label">Matrícula</label>
              <input className="input-field font-mono" value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ano</label>
              <input type="number" className="input-field" value={form.year}
                onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label">Diária (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm">R$</span>
                <input className="input-field pl-10 font-mono" placeholder="0,00"
                  value={dailyRateDisplay}
                  onChange={(e) => {
                    const masked = maskCurrency(e.target.value);
                    setDailyRateDisplay(masked);
                    setForm({ ...form, dailyRate: unmaskCurrency(masked) });
                  }} />
              </div>
            </div>
          </div>

          <div>
            <label className="label">Tipo de Propriedade</label>
            <select className="input-field" value={form.ownerType}
              onChange={(e) => setForm({ ...form, ownerType: e.target.value as OwnerType })}>
              <option value="CLIENT">Cliente</option>
              <option value="COMPANY">Empresa</option>
              <option value="BANK">Banco</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Salvando...' : editId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteVehicleId}
        onClose={() => setDeleteVehicleId(null)}
        onConfirm={() => deleteVehicleId && handleDelete(deleteVehicleId)}
        title="Remover Veículo"
        message="Tem certeza que deseja remover este veículo? Esta ação não pode ser desfeita."
        confirmText="Sim, remover"
        cancelText="Manter veículo"
        variant="danger"
        loading={deleting}
      />

      <Toast
        isOpen={toast.open}
        onClose={() => setToast({ open: false, message: '' })}
        message={toast.message}
        variant="error"
      />
    </div>
  );
}
