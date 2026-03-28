import { useState, useEffect } from 'react';
import { X, Save, Loader2, User, Building2, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileApi } from '../../api/profile.api';
import { adminApi } from '../../api/admin.api';
import { Address, Employer, ClientProfile, AgentProfile, AdminProfile } from '../../types';
import { maskPhone, unmaskPhone, maskCpf, maskRg, maskCnpj } from '../../utils/masks';
import AddressForm from './AddressForm';
import ProfessionSelect from './ProfessionSelect';
import { maskCurrency, unmaskCurrency, numberToCurrencyDisplay } from '../../utils/masks';

interface ProfileEditModalProps {
  onClose: () => void;
}

export default function ProfileEditModal({ onClose }: ProfileEditModalProps) {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Client fields
  const [clientData, setClientData] = useState<ClientProfile | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState<Address>({
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '',
  });
  const [clientProfession, setClientProfession] = useState('');
  const [clientEmployers, setClientEmployers] = useState<Employer[]>([]);

  // Agent fields
  const [agentData, setAgentData] = useState<AgentProfile | null>(null);
  const [agentCompanyName, setAgentCompanyName] = useState('');
  const [agentAddress, setAgentAddress] = useState<Address>({
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '',
  });
  const [agentPhone, setAgentPhone] = useState('');

  // Admin fields
  const [adminData, setAdminData] = useState<AdminProfile | null>(null);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.role === 'CLIENT') {
          const res = await profileApi.getClientProfile();
          setClientData(res.data);
          setClientName(res.data.name);
          setClientAddress(res.data.address || { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' });
          setClientProfession(res.data.profession);
          setClientEmployers(res.data.employers || []);
        } else if (user?.role === 'AGENT') {
          const res = await profileApi.getAgentProfile();
          setAgentData(res.data);
          setAgentCompanyName(res.data.companyName);
          setAgentAddress(res.data.address || { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' });
          setAgentPhone(res.data.phone);
        } else if (user?.role === 'ADMIN') {
          const res = await adminApi.getMyProfile();
          setAdminData(res.data);
          setAdminName(res.data.name);
        }
      } catch (err) {
        setError('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.role]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (user?.role === 'CLIENT') {
        const res = await profileApi.updateClientProfile({
          name: clientName,
          address: clientAddress,
          profession: clientProfession,
          employers: clientEmployers,
        });
        setClientData(res.data);
        // Update sessionStorage name
        if (user && clientName !== user.name) {
          const updatedUser = { ...user, name: clientName };
          login(updatedUser);
        }
      } else if (user?.role === 'AGENT') {
        const res = await profileApi.updateAgentProfile({
          companyName: agentCompanyName,
          address: agentAddress,
          phone: unmaskPhone(agentPhone),
        });
        setAgentData(res.data);
        if (user && agentCompanyName !== user.name) {
          const updatedUser = { ...user, name: agentCompanyName };
          login(updatedUser);
        }
      } else if (user?.role === 'ADMIN') {
        const res = await adminApi.updateMyProfile({ name: adminName });
        setAdminData(res.data);
        if (user && adminName !== user.name) {
          const updatedUser = { ...user, name: adminName };
          login(updatedUser);
        }
      }
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    if (user?.role === 'CLIENT') {
      setClientAddress((prev) => ({ ...prev, [field]: value }));
    } else if (user?.role === 'AGENT') {
      setAgentAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddEmployer = () => {
    setClientEmployers((prev) => [...prev, { name: '', phone: '', income: 0 }]);
  };

  const handleRemoveEmployer = (index: number) => {
    setClientEmployers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmployerChange = (index: number, field: keyof Employer, value: string | number) => {
    setClientEmployers((prev) =>
      prev.map((emp, i) => (i === index ? { ...emp, [field]: value } : emp)),
    );
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'CLIENT': return <User className="w-5 h-5 text-accent" />;
      case 'AGENT': return <Building2 className="w-5 h-5 text-accent" />;
      case 'ADMIN': return <Shield className="w-5 h-5 text-accent" />;
      default: return null;
    }
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'CLIENT': return 'Editar Perfil — Cliente';
      case 'AGENT': return 'Editar Perfil — Agente';
      case 'ADMIN': return 'Editar Perfil — Admin Geral';
      default: return 'Editar Perfil';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-primary-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-200 dark:border-primary-700">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2.5 rounded-xl">{getRoleIcon()}</div>
            <h2 className="text-xl font-bold text-primary-900 dark:text-white">{getRoleTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-primary-400 hover:text-primary-900 dark:hover:text-white hover:bg-primary-100 dark:hover:bg-primary-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Read-only fields */}
              {user?.role === 'CLIENT' && clientData && (
                <>
                  <div>
                    <label className="label">E-mail</label>
                    <input className="input-field bg-primary-50" value={clientData.email} readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">CPF</label>
                      <input className="input-field bg-primary-50 font-mono" value={maskCpf(clientData.cpf)} readOnly />
                    </div>
                    <div>
                      <label className="label">RG</label>
                      <input className="input-field bg-primary-50 font-mono" value={maskRg(clientData.rg)} readOnly />
                    </div>
                  </div>

                  {/* Editable fields */}
                  <div>
                    <label className="label">Nome</label>
                    <input
                      className="input-field"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>

                  <ProfessionSelect value={clientProfession} onChange={setClientProfession} />

                  <AddressForm
                    address={clientAddress}
                    onChange={handleAddressChange}
                  />

                  {/* Employers */}
                  <div className="border-t border-primary-200 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="label mb-0">Empregadores</label>
                      <button
                        type="button"
                        onClick={handleAddEmployer}
                        className="text-sm text-accent hover:text-accent/80 font-medium"
                      >
                        + Adicionar
                      </button>
                    </div>
                    {clientEmployers.map((emp, i) => (
                      <div key={i} className="bg-primary-50 rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-primary-500 uppercase">Empregador {i + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEmployer(i)}
                            className="text-xs text-danger hover:text-danger/80"
                          >
                            Remover
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            className="input-field"
                            placeholder="Nome da empresa"
                            value={emp.name}
                            onChange={(e) => handleEmployerChange(i, 'name', e.target.value)}
                          />
                          <input
                            className="input-field font-mono"
                            placeholder="(00) 00000-0000"
                            value={maskPhone(emp.phone)}
                            onChange={(e) => handleEmployerChange(i, 'phone', unmaskPhone(e.target.value))}
                            maxLength={15}
                          />
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm">R$</span>
                            <input
                              className="input-field pl-10 font-mono"
                              placeholder="0,00"
                              value={numberToCurrencyDisplay(emp.income)}
                              onChange={(e) => handleEmployerChange(i, 'income', unmaskCurrency(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {user?.role === 'AGENT' && agentData && (
                <>
                  <div>
                    <label className="label">E-mail</label>
                    <input className="input-field bg-primary-50" value={agentData.email} readOnly />
                  </div>
                  <div>
                    <label className="label">CNPJ</label>
                    <input className="input-field bg-primary-50 font-mono" value={maskCnpj(agentData.cnpj)} readOnly />
                  </div>

                  {/* Editable fields */}
                  <div>
                    <label className="label">Razão Social</label>
                    <input
                      className="input-field"
                      value={agentCompanyName}
                      onChange={(e) => setAgentCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Telefone</label>
                    <input
                      className="input-field font-mono"
                      placeholder="(00) 00000-0000"
                      value={maskPhone(agentPhone)}
                      onChange={(e) => setAgentPhone(unmaskPhone(e.target.value))}
                      maxLength={15}
                    />
                  </div>

                  <AddressForm
                    address={agentAddress}
                    onChange={handleAddressChange}
                  />
                </>
              )}

              {user?.role === 'ADMIN' && adminData && (
                <>
                  <div>
                    <label className="label">E-mail</label>
                    <input className="input-field bg-primary-50" value={adminData.email} readOnly />
                  </div>
                  <div>
                    <label className="label">Nome</label>
                    <input
                      className="input-field"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Messages */}
              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-success/10 border border-success/20 text-success rounded-lg px-4 py-3 text-sm">
                  {success}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-primary-200">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 px-6 py-2.5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar Alterações
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
