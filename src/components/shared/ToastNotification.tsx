import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({ show, message, onClose, duration = 3000 }: ToastNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-slate-100 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span className="font-medium text-slate-800">{message}</span>
      </div>
    </div>
  );
}
