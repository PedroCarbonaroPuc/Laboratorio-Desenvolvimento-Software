import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth.api';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authApi.login(email, password);
      login(data);
      navigate(data.role === 'CLIENT' ? '/client/dashboard' : '/agent/dashboard');
    } catch (err: any) {
      const res = err.response;
      if (!res) {
        setError('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      } else if (res.status === 401 || res.status === 403) {
        setError('E-mail ou senha inválidos. Tente novamente.');
      } else if (res.status === 404) {
        setError('Conta não encontrada. Verifique o e-mail informado.');
      } else {
        setError(res.data?.error || 'Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">Entrar na sua conta</h2>
      <p className="text-primary-500 dark:text-primary-400 mb-8">Insira suas credenciais para acessar o sistema</p>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="email"
              className="input-field pl-11"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="password"
              className="input-field pl-11"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? 'Entrando...' : 'Entrar'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-primary-500 dark:text-primary-400">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-accent font-semibold hover:text-accent-hover">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
