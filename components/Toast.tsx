
import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, message, type]); // Added message and type to dependencies

  if (!isVisible) return null;

  const typeStyles = {
    success: { bg: 'bg-green-500', icon: <CheckCircle size={20} className="mr-2" /> },
    error: { bg: 'bg-red-500', icon: <XCircle size={20} className="mr-2" /> },
    warning: { bg: 'bg-yellow-500', icon: <AlertTriangle size={20} className="mr-2" /> },
    info: { bg: 'bg-blue-500', icon: <Info size={20} className="mr-2" /> },
  };

  const currentStyle = typeStyles[type];

  return (
    <div
      className={`fixed bottom-6 right-6 ${currentStyle.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-slideUp z-[100]`}
      role="alert"
      aria-live="assertive"
    >
      {currentStyle.icon}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
