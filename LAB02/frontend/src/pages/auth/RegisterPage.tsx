import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth.api';
import { RegisterClientForm, RegisterAgentForm, Address, Employer } from '../../types';
import { User, Building2, ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { maskCpf, unmaskCpf, maskRg, maskCnpj, unmaskCnpj, maskPhone, unmaskPhone, maskCurrency, unmaskCurrency } from '../../utils/masks';
import ProfessionSelect from '../../components/common/ProfessionSelect';
import AddressForm from '../../components/common/AddressForm';

type UserType = 'CLIENT' | 'AGENT';
type Step = 'type' | 'form';

const emptyAddress: Address = {
  street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '',
};

const emptyEmployer: Employer = { name: '', phone: '', income: 0 };

function parseApiError(err: any): string {
  const res = err.response;
  if (!res) return 'Erro de conexão com o servidor. Verifique se o backend está rodando.';
  const data = res.data;
  if (res.status === 409) return data?.error || 'Este e-mail, CPF ou CNPJ já está cadastrado no sistema.';
  if (res.status === 400) {
    if (data?.fieldErrors) {
      const msgs = Object.entries(data.fieldErrors).map(
        ([field, msg]) => `• ${field}: ${msg}`,
      );
      return `Corrija os seguintes campos:\n${msgs.join('\n')}`;
    }
    return data?.error || 'Dados inválidos. Verifique os campos e tente novamente.';
  }
  if (res.status === 500) return 'Erro interno do servidor. Tente novamente em alguns instantes.';
  return data?.error || 'Ocorreu um erro inesperado. Tente novamente.';
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('type');
  const [userType, setUserType] = useState<UserType>('CLIENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [clientForm, setClientForm] = useState<RegisterClientForm>({
    name: '', email: '', password: '', cpf: '', rg: '',
    address: { ...emptyAddress }, profession: '', employers: [],
  });

  const [agentForm, setAgentForm] = useState<RegisterAgentForm>({
    companyName: '', email: '', password: '', cnpj: '',
    address: { ...emptyAddress }, phone: '',
  });

  // Display-only masked values (actual form stores raw values)
  const [cpfDisplay, setCpfDisplay] = useState('');
  const [cnpjDisplay, setCnpjDisplay] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [employerPhoneDisplays, setEmployerPhoneDisplays] = useState<string[]>([]);
  const [employerIncomeDisplays, setEmployerIncomeDisplays] = useState<string[]>([]);

  const updateClientField = (field: keyof RegisterClientForm, value: any) => {
    setClientForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAgentField = (field: keyof RegisterAgentForm, value: any) => {
    setAgentForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateClientAddress = (field: keyof Address, value: string) => {
    setClientForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const updateAgentAddress = (field: keyof Address, value: string) => {
    setAgentForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const addEmployer = () => {
    if (clientForm.employers.length < 3) {
      setClientForm((prev) => ({
        ...prev,
        employers: [...prev.employers, { ...emptyEmployer }],
      }));
      setEmployerPhoneDisplays((prev) => [...prev, '']);
      setEmployerIncomeDisplays((prev) => [...prev, '']);
    }
  };

  const removeEmployer = (index: number) => {
    setClientForm((prev) => ({
      ...prev,
      employers: prev.employers.filter((_, i) => i !== index),
    }));
    setEmployerPhoneDisplays((prev) => prev.filter((_, i) => i !== index));
    setEmployerIncomeDisplays((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEmployer = (index: number, field: keyof Employer, value: any) => {
    setClientForm((prev) => ({
      ...prev,
      employers: prev.employers.map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (userType === 'CLIENT') {
        const { data } = await authApi.registerClient(clientForm);
        login(data);
        navigate('/client/dashboard');
      } else {
        const { data } = await authApi.registerAgent(agentForm);
        login(data);
        navigate('/agent/dashboard');
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'type') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">Criar conta</h2>
        <p className="text-primary-500 dark:text-primary-400 mb-8">Selecione o tipo de conta para começar</p>

        <div className="space-y-4">
          <button
            onClick={() => { setUserType('CLIENT'); setStep('form'); }}
            className="w-full card p-6 hover:border-accent hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-xl group-hover:bg-accent/20 transition-colors">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 dark:text-white">Cliente</h3>
                <p className="text-sm text-primary-500 dark:text-primary-400">Pessoa física que deseja alugar veículos</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setUserType('AGENT'); setStep('form'); }}
            className="w-full card p-6 hover:border-accent hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-xl group-hover:bg-accent/20 transition-colors">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 dark:text-white">Agente (Empresa)</h3>
                <p className="text-sm text-primary-500 dark:text-primary-400">Empresa que gerencia e avalia pedidos</p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-primary-500 dark:text-primary-400">{' '}
          <Link to="/login" className="text-accent font-semibold hover:text-accent-hover">
            Fazer login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setStep('type')}
        className="flex items-center gap-1 text-sm text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
        Cadastro de {userType === 'CLIENT' ? 'Cliente' : 'Agente'}
      </h2>
      <p className="text-primary-500 dark:text-primary-400 mb-6">Preencha os dados para criar sua conta</p>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg mb-6 text-sm whitespace-pre-line">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {userType === 'CLIENT' ? (
          <>
            <div>
              <label className="label">Nome completo</label>
              <input className="input-field" required value={clientForm.name}
                onChange={(e) => updateClientField('name', e.target.value)} />
            </div>
            <div>
              <label className="label">E-mail</label>
              <input type="email" className="input-field" required value={clientForm.email}
                onChange={(e) => updateClientField('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Senha</label>
              <input type="password" className="input-field" required minLength={8}
                value={clientForm.password}
                onChange={(e) => updateClientField('password', e.target.value)} />
              <p className="text-xs text-primary-400 mt-1">Mínimo de 8 caracteres</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">CPF</label>
                <input className="input-field font-mono" required
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={cpfDisplay}
                  onChange={(e) => {
                    const masked = maskCpf(e.target.value);
                    setCpfDisplay(masked);
                    updateClientField('cpf', unmaskCpf(masked));
                  }} />
              </div>
              <div>
                <label className="label">RG</label>
                <input className="input-field font-mono uppercase" required
                  placeholder="MG12345678"
                  maxLength={10}
                  value={clientForm.rg}
                  onChange={(e) => updateClientField('rg', maskRg(e.target.value))} />
                <p className="text-xs text-primary-400 mt-1">Ex: MG12345678</p>
              </div>
            </div>

            <ProfessionSelect
              value={clientForm.profession}
              onChange={(val) => updateClientField('profession', val)}
            />

            <AddressForm
              address={clientForm.address}
              onChange={updateClientAddress}
            />

            <div className="border-t border-primary-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="label mb-0">Empregadores (máx. 3)</label>
                {clientForm.employers.length < 3 && (
                  <button type="button" onClick={addEmployer}
                    className="text-accent text-sm font-medium flex items-center gap-1 hover:text-accent-hover">
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                )}
              </div>
              {clientForm.employers.map((emp, i) => (
                <div key={i} className="card p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-primary-700">Empregador {i + 1}</span>
                    <button type="button" onClick={() => removeEmployer(i)}
                      className="text-danger hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input className="input-field" placeholder="Nome da empresa"
                      value={emp.name}
                      onChange={(e) => updateEmployer(i, 'name', e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="input-field" placeholder="(00) 00000-0000"
                        value={employerPhoneDisplays[i] || ''}
                        onChange={(e) => {
                          const masked = maskPhone(e.target.value);
                          setEmployerPhoneDisplays((prev) => {
                            const copy = [...prev];
                            copy[i] = masked;
                            return copy;
                          });
                          updateEmployer(i, 'phone', unmaskPhone(masked));
                        }} />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm">R$</span>
                        <input className="input-field pl-10 font-mono" placeholder="0,00"
                          value={employerIncomeDisplays[i] || ''}
                          onChange={(e) => {
                            const masked = maskCurrency(e.target.value);
                            setEmployerIncomeDisplays((prev) => {
                              const copy = [...prev];
                              copy[i] = masked;
                              return copy;
                            });
                            updateEmployer(i, 'income', unmaskCurrency(masked));
                          }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="label">Razão social</label>
              <input className="input-field" required value={agentForm.companyName}
                onChange={(e) => updateAgentField('companyName', e.target.value)} />
            </div>
            <div>
              <label className="label">E-mail</label>
              <input type="email" className="input-field" required value={agentForm.email}
                onChange={(e) => updateAgentField('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Senha</label>
              <input type="password" className="input-field" required minLength={8}
                value={agentForm.password}
                onChange={(e) => updateAgentField('password', e.target.value)} />
              <p className="text-xs text-primary-400 mt-1">Mínimo de 8 caracteres</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">CNPJ</label>
                <input className="input-field font-mono" required
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  value={cnpjDisplay}
                  onChange={(e) => {
                    const masked = maskCnpj(e.target.value);
                    setCnpjDisplay(masked);
                    updateAgentField('cnpj', unmaskCnpj(masked));
                  }} />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input className="input-field" required
                  placeholder="(00) 00000-0000"
                  value={phoneDisplay}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    setPhoneDisplay(masked);
                    updateAgentField('phone', unmaskPhone(masked));
                  }} />
              </div>
            </div>

            <AddressForm
              address={agentForm.address}
              onChange={updateAgentAddress}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
        >
          {loading ? 'Cadastrando...' : 'Criar conta'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
