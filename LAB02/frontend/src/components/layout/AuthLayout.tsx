import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Car } from 'lucide-react';
import CarIllustration from '../common/CarIllustration';

export default function AuthLayout() {
  const { isAuthenticated, isClient } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isClient ? '/client/dashboard' : '/agent/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-primary-900 flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary-950/80" />
        <CarIllustration className="absolute bottom-8 left-0 right-0 w-full opacity-80" />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-accent p-3 rounded-2xl">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-racing text-white tracking-tight">RentaCar</h1>
          </div>
          <p className="text-primary-300 text-lg max-w-md leading-relaxed">
            Plataforma completa para gestão de aluguéis de automóveis.
            Solicite, acompanhe e gerencie seus pedidos com facilidade.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-primary-400 text-sm mt-1">Veículos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">10k+</div>
              <div className="text-primary-400 text-sm mt-1">Clientes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-primary-400 text-sm mt-1">Satisfação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-primary-900 lg:rounded-l-3xl">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-accent p-2 rounded-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-racing text-primary-900 dark:text-white">RentaCar</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
