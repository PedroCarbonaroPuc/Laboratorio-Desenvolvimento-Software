import { useState, useRef, useEffect } from 'react';
import { PROFESSIONS } from '../../utils/professions';
import { Search, ChevronDown, X } from 'lucide-react';

interface ProfessionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProfessionSelect({ value, onChange }: ProfessionSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const filtered = PROFESSIONS.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (profession: string) => {
    if (profession === '__OTHER__') {
      setCustomMode(true);
      setOpen(false);
      setSearch('');
      return;
    }
    onChange(profession);
    setCustomMode(false);
    setCustomValue('');
    setOpen(false);
    setSearch('');
  };

  const handleCustomConfirm = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setCustomMode(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label className="label">Profissão</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-field w-full text-left flex items-center justify-between"
      >
        <span className={value ? 'text-primary-900' : 'text-primary-400'}>
          {value || 'Selecione sua profissão'}
        </span>
        <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-primary-200 rounded-lg shadow-lg max-h-72 flex flex-col">
          <div className="p-2 border-b border-primary-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input
                ref={searchRef}
                type="text"
                className="w-full pl-8 pr-3 py-2 text-sm border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Buscar profissão..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            <button
              type="button"
              onClick={() => handleSelect('__OTHER__')}
              className="w-full text-left px-3 py-2.5 text-sm font-semibold text-accent hover:bg-accent/5 border-b border-primary-100 sticky top-0 bg-white"
            >
              ✏️ Outra (digitar manualmente)
            </button>
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-primary-400 text-center">Nenhuma profissão encontrada</div>
            ) : (
              filtered.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelect(p)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-primary-50 transition-colors ${
                    value === p ? 'bg-accent/5 text-accent font-medium' : 'text-primary-700'
                  }`}
                >
                  {p}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {customMode && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Digite sua profissão"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            autoFocus
          />
          <button type="button" onClick={handleCustomConfirm} className="btn-primary text-sm px-4">
            OK
          </button>
          <button
            type="button"
            onClick={() => { setCustomMode(false); setCustomValue(''); }}
            className="p-2 text-primary-400 hover:text-primary-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
