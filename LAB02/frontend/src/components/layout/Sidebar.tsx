import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import ProfileEditModal from '../common/ProfileEditModal';
import {
  Car,
  LayoutDashboard,
  FileText,
  CarFront,
  ClipboardList,
  Star,
  Users,
  LogOut,
  User,
  FlaskConical,
  Moon,
  Sun,
} from 'lucide-react';

export default function Sidebar() {
  const { user, isClient, isAgent, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-accent text-white shadow-lg shadow-accent/25'
        : 'text-primary-400 hover:text-white hover:bg-primary-light'
    }`;

  const labelClass = `whitespace-nowrap transition-opacity duration-200 ${
    isExpanded ? 'opacity-100' : 'opacity-0'
  }`;

  return (
    <>
      <aside
        className={`hidden lg:flex flex-shrink-0 h-screen flex-col bg-primary-900 transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'w-64 shadow-2xl shadow-black/20' : 'w-20'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-primary-800">
          <div className="bg-accent p-2 rounded-xl flex-shrink-0">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-xl font-bold text-white tracking-tight whitespace-nowrap transition-opacity duration-200 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            RentaCar
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-hidden">
          <div
            className={`text-xs font-semibold text-primary-500 uppercase tracking-wider px-4 mb-3 whitespace-nowrap transition-opacity duration-200 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Menu
          </div>

          {isClient && (
            <>
              <NavLink to="/client/dashboard" className={linkClass}>
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <span className={labelClass}>Dashboard</span>
              </NavLink>
              <NavLink to="/client/vehicles" className={linkClass}>
                <CarFront className="w-5 h-5 flex-shrink-0" />
                <span className={labelClass}>Veículos</span>
              </NavLink>
              <NavLink to="/client/orders" className={linkClass}>
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className={labelClass}>Meus Pedidos</span>
              </NavLink>
            </>
          )}

          {isAgent && (
            <>
              <NavLink to="/agent/dashboard" className={linkClass}>
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <span className={labelClass}>Dashboard</span>
              </NavLink>
              <NavLink to="/agent/orders" className={linkClass}>
                <ClipboardList className="w-5 h-5 flex-shrink-0" />
                <span className={labelClass}>Pedidos</span>
              </NavLink>
              <NavLink to="/agent/vehicles" className={linkClass}>
                <CarFront className="w-5 h-5 flex-shrink-0" />
                <span className={labelClass}>Veículos</span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/users" className={linkClass}>
                <Users className="w-5 h-5 flex-shrink-0" />
                <span className={labelClass}>Usuários</span>
              </NavLink>
              <NavLink to="/admin/load-tests" className={linkClass}>
                <FlaskConical className="w-5 h-5 flex-shrink-0" />
                <span className={labelClass}>Testes de Carga</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* User & Logout */}
        <div className="p-3 border-t border-primary-800 space-y-1">
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-primary-400 hover:text-white hover:bg-primary-light transition-all duration-200"
          >
            <div className="bg-accent/10 p-2 rounded-lg flex-shrink-0">
              <User className="w-4 h-4 text-accent" />
            </div>
            <span
              className={`whitespace-nowrap truncate transition-opacity duration-200 ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {user?.name}
            </span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-primary-400 hover:text-white hover:bg-primary-light transition-all duration-200"
          >
            <div className="p-2 flex-shrink-0">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            <span
              className={`whitespace-nowrap transition-opacity duration-200 ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {isDark ? 'Modo Claro' : 'Modo Escuro'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-primary-400 hover:text-danger hover:bg-danger/5 transition-all duration-200"
          >
            <div className="p-2 flex-shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <span
              className={`whitespace-nowrap transition-opacity duration-200 ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Sair
            </span>
          </button>

          <div
            className={`flex items-center gap-2 px-4 py-2 text-primary-600 text-xs whitespace-nowrap transition-opacity duration-200 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Star className="w-3 h-3 flex-shrink-0" />
            <span>RentaCar v1.0</span>
          </div>
        </div>
      </aside>

      {profileOpen && <ProfileEditModal onClose={() => setProfileOpen(false)} />}
    </>
  );
}
