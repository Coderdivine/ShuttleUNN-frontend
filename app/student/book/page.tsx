'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';
import { Notification, useNotification } from '@/components/Notification';
import { shuttleRoutes } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';

export default function RequestCardPage() {
  const router = useRouter();
  const { notification, showNotification, clearNotification } = useNotification();
  const [cardType, setCardType] = useState<'physical' | 'virtual'>('physical');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('success', 'NFC Card request submitted! Admin will approve and issue your card.');
    setTimeout(() => router.push('/student/dashboard'), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/student/dashboard" className="flex items-center gap-3 text-gray-600 hover:text-black">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <Logo className="h-8" />
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">REQUEST NFC CARD</h1>
          <p className="text-gray-600">Get your NFC card to pay for shuttle rides with a simple tap</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card Type Selection */}
          <div>
            <h2 className="text-xl font-bold mb-4">Select Card Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCardType('physical')}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                  cardType === 'physical'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <CreditCard className="mb-4" size={32} />
                <h3 className="text-2xl font-bold mb-2">Physical NFC Card</h3>
                <p className={`text-sm mb-4 ${cardType === 'physical' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Physical card that you tap on the bus reader
                </p>
                <div className="text-3xl font-bold">{formatCurrency(250)}</div>
                <p className={`text-sm mt-1 ${cardType === 'physical' ? 'text-gray-300' : 'text-gray-600'}`}>
                  One-time fee
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCardType('virtual')}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                  cardType === 'virtual'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <MapPin className="mb-4" size={32} />
                <h3 className="text-2xl font-bold mb-2">Virtual Card</h3>
                <p className={`text-sm mb-4 ${cardType === 'virtual' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Use your phone to pay (Coming Soon)
                </p>
                <div className="text-3xl font-bold">{formatCurrency(0)}</div>
                <p className={`text-sm mt-1 ${cardType === 'virtual' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Free
                </p>
              </button>
            </div>
          </div>

          {/* Available Routes Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4">Available Routes</h3>
            <div className="space-y-4">
              {shuttleRoutes.map((route) => (
                <div key={route.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h4 className="font-medium">{route.name}</h4>
                    <p className="text-sm text-gray-600">{route.from} → {route.to}</p>
                    <p className="text-xs text-gray-500">~{route.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatCurrency(route.fare)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4">Request Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Card Type:</span>
                <span className="font-medium capitalize">{cardType} NFC Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">Pending Approval</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
                <span className="font-bold">Card Fee:</span>
                <span className="font-bold">{formatCurrency(cardType === 'physical' ? 250 : 0)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {cardType === 'physical' 
                  ? 'The fee will be deducted from your wallet once your request is approved by admin.'
                  : 'Virtual cards are coming soon. You\'ll be notified when available.'}
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full uppercase font-semibold" 
            size="lg"
            disabled={cardType === 'virtual'}
          >
            {cardType === 'virtual' ? 'COMING SOON' : 'SUBMIT REQUEST'}
          </Button>
        </form>
      </main>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}
    </div>
  );
}
