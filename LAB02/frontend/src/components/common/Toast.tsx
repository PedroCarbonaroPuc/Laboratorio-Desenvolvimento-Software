import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

const variantConfig: Record<ToastVariant, {
  icon: typeof CheckCircle;
  bg: string;
  iconColor: string;
  border: string;
}> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    iconColor: 'text-success',
    border: 'border-success/30',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 dark:bg-red-900/30',
    iconColor: 'text-danger',
    border: 'border-danger/30',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    iconColor: 'text-warning',
    border: 'border-warning/30',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-accent',
    border: 'border-accent/30',
  },
};

export default function Toast({ isOpen, onClose, message, variant = 'error', duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!isOpen || duration <= 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className="fixed top-6 right-6 z-[70] animate-in">
      <div className={`${config.bg} border ${config.border} rounded-xl shadow-lg px-5 py-4 flex items-center gap-3 max-w-sm`}>
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
        <p className="text-sm font-medium text-primary-900 dark:text-primary-100 flex-1">
          {message}
        </p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-primary-400" />
        </button>
      </div>
    </div>
  );
}
