import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 border rounded-lg shadow-lg ${bgColor} ${textColor} max-w-md transform transition-all duration-300 ease-in-out`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className={`w-5 h-5 mr-3 ${iconColor}`} />
        ) : (
          <XCircle className={`w-5 h-5 mr-3 ${iconColor}`} />
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className={`ml-4 ${iconColor} hover:opacity-70 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
