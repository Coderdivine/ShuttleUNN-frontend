'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Notification, useNotification } from '@/components/Notification';
import { useAppState } from '@/lib/AppContext';

const topUpAmounts = [500, 1000, 2000, 5000, 10000, 15000];

export default function WalletPage() {
  const router = useRouter();
  const { user, updateWallet } = useAppState();
  const { notification, showNotification, clearNotification } = useNotification();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value && !isNaN(Number(value))) {
      setSelectedAmount(Number(value));
    } else {
      setSelectedAmount(null);
    }
  };

  const handleProceed = () => {
    if (!selectedAmount || selectedAmount <= 0) {
      showNotification('error', 'Please enter a valid amount');
      return;
    }
    setIsProcessing(true);
    showNotification('success', `Top-up of ${formatCurrency(selectedAmount)} successful!`);
    
    // Update wallet balance
    updateWallet(selectedAmount);
    
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/student/dashboard');
    }, 1500);
  };

  const newBalance = user.walletBalance + (selectedAmount || 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/student/dashboard" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <Logo className="h-6" />
          <div className="flex items-center gap-2 text-xs">
            <Link href="/driver/auth/login" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors font-light">
              Driver
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-light mb-2">
            Top Up Wallet
          </h1>
          <p className="text-gray-600 text-sm">
            Add funds instantly. Secure and fast.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Balance & Selection */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Balance Card */}
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8">
              <p className="text-xs text-gray-300 uppercase tracking-wider mb-2">Current Balance</p>
              <h2 className="text-4xl sm:text-5xl font-light mb-6">{formatCurrency(user.walletBalance)}</h2>
              <div className="pt-4 border-t border-gray-700 text-xs text-gray-300">
                Available for rides and services
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Quick Amount</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {topUpAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleSelectAmount(amount)}
                    disabled={isProcessing}
                    className={cn(
                      'p-4 rounded-xl text-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
                      selectedAmount === amount
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    )}
                  >
                    <p className="text-sm font-medium">{formatCurrency(amount)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Or Enter Custom Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                <input
                  type="number"
                  placeholder="e.g. 3500"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  disabled={isProcessing}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Action */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 h-fit sticky top-20">
              <h3 className="font-medium text-sm">Transaction Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance</span>
                  <span className="font-medium">{formatCurrency(user.walletBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">You're Adding</span>
                  <span className="font-medium text-green-600">
                    {selectedAmount ? '+' + formatCurrency(selectedAmount) : '—'}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between">
                  <span className="font-medium">New Balance</span>
                  <span className="font-bold text-lg">{formatCurrency(newBalance)}</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                disabled={!selectedAmount || selectedAmount <= 0 || isProcessing}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Powered by secure payment gateway
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Why Top Up?</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              Keep your wallet loaded for seamless shuttle rides across campus and beyond. No minimum balance required.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Payment Methods</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              We accept all major payment methods. Your transactions are encrypted and secure.
            </p>
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

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
