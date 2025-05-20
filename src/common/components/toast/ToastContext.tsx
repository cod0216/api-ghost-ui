import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '@/common/types/toastTpyes';
import ToastContainer from '@/common/components/toast/ToastContainer';

interface ToastContextValue {
  addToast: (messege: string, duration?: number) => void;
}
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, duration }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};
