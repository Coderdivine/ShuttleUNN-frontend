'use client';

import { useEffect, useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Notification = ({ type, message, onClose, duration = 3500 }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      container: 'bg-white text-black border border-gray-200 shadow-lg',
      icon: 'text-green-600',
      iconBg: 'bg-green-50',
    },
    error: {
      container: 'bg-white text-black border border-red-200 shadow-lg',
      icon: 'text-red-600',
      iconBg: 'bg-red-50',
    },
    info: {
      container: 'bg-white text-black border border-gray-200 shadow-lg',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
  };

  const style = styles[type];

  return (
    <div
      className={cn(
        'fixed bottom-24 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 z-50 max-w-sm',
        'flex items-start gap-3 px-4 py-3 rounded-xl',
        'transition-all duration-300',
        isVisible ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-2',
        style.container
      )}
    >
      <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5', style.iconBg)}>
        {type === 'success' && <Check className={cn('w-3 h-3', style.icon)} />}
        {type === 'error' && <X className={cn('w-3 h-3', style.icon)} />}
        {type === 'info' && <AlertCircle className={cn('w-3 h-3', style.icon)} />}
      </div>
      <p className="text-sm font-light leading-snug flex-1">{message}</p>
    </div>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    clearNotification,
  };
};
