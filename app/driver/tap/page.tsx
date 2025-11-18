'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { ArrowLeft, QrCode, Building2, Copy, Check } from 'lucide-react';
import { Notification, useNotification } from '@/components/Notification';
import { formatCurrency } from '@/lib/utils';
import { dummyDriver } from '@/lib/dummyData';

export default function TapPaymentPage() {
  const { notification, showNotification, clearNotification } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState<'qrcode' | 'transfer'>('qrcode');
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(dummyDriver.bankDetails.accountNumber);
    setCopied(true);
    showNotification('success', 'Account number copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/driver/dashboard" className="flex items-center gap-3 text-gray-600 hover:text-black">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <Logo className="h-8" />
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Payment Collection</h1>
          <p className="text-gray-600">Choose how you want to receive payment</p>
        </div>

        {/* Payment Method Toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setPaymentMethod('qrcode')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              paymentMethod === 'qrcode'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <QrCode size={18} />
            QR Code
          </button>
          <button
            onClick={() => setPaymentMethod('transfer')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              paymentMethod === 'transfer'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Building2 size={18} />
            Bank Transfer
          </button>
        </div>

        {/* QR Code View */}
        {paymentMethod === 'qrcode' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
              <div className="bg-gray-100 rounded-xl p-8 mb-6 inline-block">
                <QrCode size={200} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Scan to Pay</h2>
              <p className="text-gray-600 mb-6">Student can scan this QR code with their app</p>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Fare Amount</p>
                <p className="text-3xl font-bold">{formatCurrency(200)}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 text-center">
                ℹ️ The QR code contains your bus number and route information
              </p>
            </div>
          </div>
        )}

        {/* Bank Transfer View */}
        {paymentMethod === 'transfer' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
              <div className="text-center pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-2">Bank Transfer Details</h2>
                <p className="text-gray-600">Share these details with the student</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Bank Name</p>
                  <p className="text-lg font-semibold">{dummyDriver.bankDetails.bankName}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Account Name</p>
                  <p className="text-lg font-semibold">{dummyDriver.bankDetails.accountName}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Account Number</p>
                    <button
                      onClick={handleCopyAccount}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-2xl font-bold font-mono">{dummyDriver.bankDetails.accountNumber}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Amount to Receive</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(200)}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800 text-center">
                ⚠️ Please confirm receipt of payment before allowing boarding
              </p>
            </div>
          </div>
        )}

        {/* Route Info */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-500">Bus Number</p>
              <p className="font-semibold">{dummyDriver.busNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Current Route</p>
              <p className="font-semibold">{dummyDriver.route}</p>
            </div>
          </div>
        </div>
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
