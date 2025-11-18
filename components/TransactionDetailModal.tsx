'use client';

import React from 'react';
import { X, Wallet, Smartphone, QrCode, Zap, MapPin, Watch, Clock } from 'lucide-react';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    date: string;
    time: string;
    studentName?: string;
    studentId?: string;
    cardId?: string;
    route: string;
    from: string;
    to: string;
    busNumber: string;
    amount: number;
    status: string;
    paymentMethod: 'card' | 'phone' | 'qrcode' | 'transfer';
  } | null;
}

const paymentMethodConfig = {
  card: { icon: Wallet, label: 'NFC Card', bgColor: 'bg-blue-50', color: 'text-blue-600' },
  phone: { icon: Smartphone, label: 'Mobile Wallet', bgColor: 'bg-green-50', color: 'text-green-600' },
  qrcode: { icon: QrCode, label: 'QR Code', bgColor: 'bg-purple-50', color: 'text-purple-600' },
  transfer: { icon: Zap, label: 'Bank Transfer', bgColor: 'bg-orange-50', color: 'text-orange-600' },
};

export default function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  if (!isOpen || !transaction) return null;

  const PaymentIcon = paymentMethodConfig[transaction.paymentMethod].icon;
  const paymentLabel = paymentMethodConfig[transaction.paymentMethod].label;
  const paymentBg = paymentMethodConfig[transaction.paymentMethod].bgColor;
  const paymentColor = paymentMethodConfig[transaction.paymentMethod].color;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal - Bottom sheet on mobile, side panel on desktop */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end pointer-events-none">
        <div className="pointer-events-auto w-full sm:w-[450px] h-3/4 sm:h-full bg-white sm:shadow-2xl flex flex-col">
          {/* Header */}
          <div className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-light">Trip Details</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Route Card */}
              <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-5 border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-light">From</p>
                      <p className="text-sm font-medium truncate">{transaction.from}</p>
                    </div>
                  </div>
                  <div className="h-0.5 bg-gray-200 mx-5"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-light">To</p>
                      <p className="text-sm font-medium truncate">{transaction.to}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Card - Highlight */}
              <div className="bg-black rounded-2xl p-5 sm:p-6 text-white text-center">
                <p className="text-xs sm:text-sm opacity-70 font-light mb-1">Amount Paid</p>
                <p className="text-3xl sm:text-4xl font-light mb-2">₦{transaction.amount.toLocaleString()}</p>
                <p className="text-xs sm:text-sm opacity-60 font-light capitalize">Status: {transaction.status}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Watch size={16} className="text-gray-400" />
                    <p className="text-xs text-gray-500 font-light">Date</p>
                  </div>
                  <p className="text-sm font-medium">{transaction.date}</p>
                </div>

                {/* Time */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-gray-400" />
                    <p className="text-xs text-gray-500 font-light">Time</p>
                  </div>
                  <p className="text-sm font-medium">{transaction.time}</p>
                </div>
              </div>

              {/* Bus Number */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
                <p className="text-xs text-gray-500 font-light mb-2">Bus Number</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{transaction.busNumber}</p>
              </div>

              {/* Payment Method */}
              <div className={`${paymentBg} rounded-xl p-4 sm:p-5`}>
                <p className="text-xs text-gray-600 font-light mb-3">Payment Method</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/60 flex items-center justify-center shrink-0">
                    <PaymentIcon size={24} className={paymentColor} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm sm:text-base font-medium ${paymentColor}`}>{paymentLabel}</p>
                    <p className="text-xs text-gray-600 capitalize">{transaction.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Transaction ID */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                <p className="text-xs text-gray-500 font-light mb-2">Transaction ID</p>
                <p className="text-xs sm:text-sm font-mono font-light break-all text-gray-700">{transaction.id}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 bg-black text-white rounded-xl text-sm font-light hover:bg-gray-800 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
