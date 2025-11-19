'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Notification, useNotification } from '@/components/Notification';
import { useAppState } from '@/lib/AppContext';

const topUpAmounts = [500, 1000, 2000, 5000, 10000, 15000];
const paymentMethods = [
  { id: 'card', label: 'Paystack (Card/Bank)', icon: '💳' },
];

function WalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateWallet, verifyPayment, isLoading, error, clearError, loadUserData, isHydrated, userType } = useAppState();
  const { notification, showNotification, clearNotification } = useNotification();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);

  // Check for payment reference in URL (callback from Paystack)
  useEffect(() => {
    const reference = searchParams.get('reference');
    // Wait for user to load, then verify payment (only once)
    if (reference && user?.id && !isVerifying && !hasAttemptedVerification) {
      setIsVerifying(true);
      setHasAttemptedVerification(true);
      handlePaymentVerification(reference);
    }
  }, [searchParams, user?.id, isVerifying, hasAttemptedVerification]);

  const handlePaymentVerification = async (reference: string) => {
    try {
      const result = await verifyPayment(reference);
      if (result.success) {
        showNotification('success', `Payment verified successfully! ${result.newBalance ? `New balance: ${formatCurrency(result.newBalance)}` : ''}`);
        setTimeout(() => {
          router.push('/student/dashboard');
        }, 3000);
      } else {
        showNotification('error', result.message);
        setIsVerifying(false);
      }
    } catch (err: any) {
      showNotification('error', 'Failed to verify payment');
      setIsVerifying(false);
    }
  };

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    if (error) clearError();
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value && !isNaN(Number(value))) {
      setSelectedAmount(Number(value));
    } else {
      setSelectedAmount(null);
    }
    if (error) clearError();
  };

  const handleProceed = async () => {
    if (!selectedAmount || selectedAmount <= 0) {
      showNotification('error', 'Please enter a valid amount');
      return;
    }

    if (selectedAmount < 100) {
      showNotification('error', 'Minimum top-up amount is ₦100');
      return;
    }

    if (selectedAmount > 1000000) {
      showNotification('error', 'Maximum top-up amount is ₦1,000,000');
      return;
    }

    setIsProcessing(true);

    try {
      await updateWallet(selectedAmount, selectedPaymentMethod);
      showNotification('success', `Top-up of ${formatCurrency(selectedAmount)} successful!`);

      setTimeout(() => {
        setIsProcessing(false);
        router.push('/student/dashboard');
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Top-up failed';
      showNotification('error', errorMsg);
      setIsProcessing(false);
    }
  };

  const newBalance = (user?.walletBalance || 0) + (selectedAmount || 0);

  // Show loading screen when hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading screen when verifying payment
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
          <p className="text-xs text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

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
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light mb-2">
              Top Up Wallet
            </h1>
            <p className="text-gray-600 text-sm">
              Add funds instantly. Secure and fast.
            </p>
          </div>
          <Link href="/student/wallet/transactions">
            <button className="text-xs font-medium text-black hover:underline flex items-center gap-1">
              View History →
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Balance & Selection */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Balance Card */}
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8">
              <p className="text-xs text-gray-300 uppercase tracking-wider mb-2">Current Balance</p>
              <h2 className="text-4xl sm:text-5xl font-light mb-6">{formatCurrency(user?.walletBalance || 0)}</h2>
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
                    disabled={isProcessing || isLoading}
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
                  disabled={isProcessing || isLoading}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    disabled={isProcessing || isLoading}
                    className={cn(
                      'p-4 rounded-xl text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                      selectedPaymentMethod === method.id
                        ? 'bg-black text-white ring-2 ring-black'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    )}
                  >
                    <p className="text-xl mb-1">{method.icon}</p>
                    <p className="text-xs font-medium">{method.label}</p>
                  </button>
                ))}
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
                  <span className="font-medium">{formatCurrency(user?.walletBalance || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">You're Adding</span>
                  <span className="font-medium text-green-600">
                    {selectedAmount ? '+' + formatCurrency(selectedAmount) : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{selectedPaymentMethod}</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between">
                  <span className="font-medium">New Balance</span>
                  <span className="font-bold text-lg">{formatCurrency(newBalance)}</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                disabled={!selectedAmount || selectedAmount <= 0 || isProcessing || isLoading || isVerifying}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {isVerifying ? 'Verifying Payment...' : isProcessing || isLoading ? 'Processing...' : 'Proceed to Payment'}
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
              We accept all major payment methods: Card, Phone Transfer, QR Code, and Bank Transfer. Your transactions are encrypted and secure.
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

export default function WalletPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <WalletContent />
    </Suspense>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
