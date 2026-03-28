export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function unmaskCpf(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskRg(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
}

export function maskCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function unmaskCnpj(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
}

export function unmaskCep(value: string): string {
  return value.replace(/\D/g, '');
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

/**
 * Formats a numeric value (in cents) to Brazilian currency display: "1.234,56"
 * Input: raw string from the user (digits only after stripping)
 * Stores: numeric value in cents, displays formatted string
 */
export function maskCurrency(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  const reais = (cents / 100).toFixed(2);
  const [intPart, decPart] = reais.split('.');
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted},${decPart}`;
}

/** Converts masked currency string "1.234,56" to a number 1234.56 */
export function unmaskCurrency(value: string): number {
  if (!value) return 0;
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

/** Converts a number (e.g. 1234.56) to the masked display string "1.234,56" */
export function numberToCurrencyDisplay(value: number): string {
  if (!value) return '';
  const cents = Math.round(value * 100).toString();
  return maskCurrency(cents);
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data: ViaCepResponse = await response.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}
