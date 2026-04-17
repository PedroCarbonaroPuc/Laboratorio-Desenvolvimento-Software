import { ReactNode, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

type ModalVariant = 'danger' | 'warning' | 'success' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  loading?: boolean;
}

const variantConfig: Record<ModalVariant, {
  icon: typeof AlertTriangle;
  iconBg: string;
  iconColor: string;
  confirmBtn: string;
}> = {
  danger: {
    icon: XCircle,
    iconBg: 'bg-red-50 dark:bg-red-900/30',
    iconColor: 'text-danger',
    confirmBtn: 'btn-danger',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50 dark:bg-amber-900/30',
    iconColor: 'text-warning',
    confirmBtn: 'bg-warning text-white font-medium px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warning/50',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    iconColor: 'text-success',
    confirmBtn: 'bg-success text-white font-medium px-6 py-2.5 rounded-lg hover:bg-emerald-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-success/50',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-accent',
    confirmBtn: 'btn-primary',
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white dark:bg-primary-800 rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 animate-in">
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
              <Icon className={`w-7 h-7 ${config.iconColor}`} />
            </div>

            <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
              {title}
            </h3>

            <p className="text-sm text-primary-500 dark:text-primary-400 mb-6 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`${config.confirmBtn} flex-1 flex items-center justify-center gap-2`}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
