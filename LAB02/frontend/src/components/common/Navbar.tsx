import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'CLIENT': return 'Painel do Cliente';
      case 'AGENT': return 'Painel do Agente';
      case 'ADMIN': return 'Painel do Admin Geral';
      default: return '';
    }
  };

  return (
    <header className="bg-white dark:bg-primary-900 border-b border-primary-200 dark:border-primary-700 px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary-900 dark:text-white">
            Bem-vindo, {user?.name}
          </h2>
          <p className="text-sm text-primary-500 dark:text-primary-400">
            {getRoleLabel()}
          </p>
        </div>

        {/* Mobile only — desktop logout is in the sidebar */}
        <button
          onClick={handleLogout}
          className="lg:hidden flex items-center gap-2 text-sm text-primary-500 hover:text-danger transition-colors px-3 py-2 rounded-lg hover:bg-danger/5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
