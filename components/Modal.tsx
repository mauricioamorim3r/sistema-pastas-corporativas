
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-4xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title" // Title will be read by screen readers
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4 ${sizeClasses[size]} w-full transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalShow max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
        style={{ animationName: 'modalShowAnim', animationDuration: '0.3s', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 scrollbar-custom">{children}</div>
      </div>
      <style>{`
        @keyframes modalShowAnim {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Modal;
