import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-green-500" />,
    error: <AlertTriangle className="text-red-500" />,
    info: <Info className="text-blue-500" />,
  };
  
  const styles = {
    success: 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border w-auto max-w-sm animate-fade-in ${styles[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;