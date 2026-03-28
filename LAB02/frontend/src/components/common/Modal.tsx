import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white dark:bg-primary-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-100 dark:hover:bg-primary-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-primary-500 dark:text-primary-400" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
