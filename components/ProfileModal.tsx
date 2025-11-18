'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function ProfileModal({ isOpen, onClose, children, title = 'EDIT PROFILE' }: ProfileModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal - Desktop: slides from right | Mobile: slides from bottom */}
      <div
        className={cn(
          'fixed z-50 bg-white shadow-2xl transition-transform duration-300 ease-out',
          // Desktop: right side, full height
          'hidden md:block right-0 top-0 h-full w-[420px]',
          'rounded-l-3xl',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-5 flex items-center justify-between z-10 border-b border-gray-200">
          <h2 className="text-xl font-semibold tracking-wide uppercase">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-73px)] px-6 py-6">
          {children}
        </div>
      </div>

      {/* Mobile: slides from bottom */}
      <div
        className={cn(
          'fixed z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out md:hidden',
          'bottom-0 left-0 right-0 w-full max-h-[90vh]',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between z-10 border-b border-gray-200">
          <h2 className="text-lg font-semibold tracking-wide uppercase">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(90vh-100px)] px-6 py-6 pb-8">
          {children}
        </div>
      </div>
    </>
  );
}
