import { useState } from 'react';
import { Address } from '../../types';
import { maskCep, unmaskCep, fetchAddressByCep } from '../../utils/masks';
import { Search, Loader2, MapPin } from 'lucide-react';

interface AddressFormProps {
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
}

export default function AddressForm({ address, onChange }: AddressFormProps) {
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const handleCepSearch = async () => {
    const cleanCep = unmaskCep(address.zipCode);
    if (cleanCep.length !== 8) {
      setCepError('CEP deve ter 8 dígitos');
      return;
    }
    setCepError('');
    setCepLoading(true);
    const data = await fetchAddressByCep(cleanCep);
    setCepLoading(false);
    if (!data) {
      setCepError('CEP não encontrado');
      return;
    }
    onChange('street', data.logradouro);
    onChange('neighborhood', data.bairro);
    onChange('city', data.localidade);
    onChange('state', data.uf);
    if (data.complemento) onChange('complement', data.complemento);
  };

  const handleCepKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCepSearch();
    }
  };

  return (
    <div className="border-t border-primary-200 pt-4 mt-4">
      <label className="label flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-accent" /> Endereço
      </label>

      <div className="mb-3">
        <label className="text-xs font-medium text-primary-500 mb-1 block">CEP</label>
        <div className="flex gap-2">
          <input
            className="input-field flex-1 font-mono text-lg tracking-wider"
            placeholder="00000-000"
            value={maskCep(address.zipCode)}
            onChange={(e) => onChange('zipCode', unmaskCep(e.target.value))}
            onKeyDown={handleCepKeyDown}
            maxLength={9}
          />
          <button
            type="button"
            onClick={handleCepSearch}
            disabled={cepLoading}
            className="btn-primary px-4 flex items-center gap-2 text-sm"
          >
            {cepLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Buscar
          </button>
        </div>
        {cepError && <p className="text-xs text-danger mt-1">{cepError}</p>}
      </div>

      <div className="space-y-3">
        <input className="input-field" placeholder="Rua / Logradouro" required
          value={address.street}
          onChange={(e) => onChange('street', e.target.value)} />
        <div className="grid grid-cols-3 gap-3">
          <input className="input-field" placeholder="Número" required
            value={address.number}
            onChange={(e) => onChange('number', e.target.value)} />
          <input className="input-field col-span-2" placeholder="Complemento"
            value={address.complement || ''}
            onChange={(e) => onChange('complement', e.target.value)} />
        </div>
        <input className="input-field" placeholder="Bairro" required
          value={address.neighborhood}
          onChange={(e) => onChange('neighborhood', e.target.value)} />
        <div className="grid grid-cols-3 gap-3">
          <input className="input-field col-span-1" placeholder="Cidade" required
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)} />
          <select
            className="input-field"
            required
            value={address.state}
            onChange={(e) => onChange('state', e.target.value)}
          >
            <option value="">UF</option>
            {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
          <input className="input-field font-mono" placeholder="CEP" required readOnly
            value={maskCep(address.zipCode)} />
        </div>
      </div>
    </div>
  );
}
