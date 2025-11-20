'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAppState } from '@/lib/AppContext';
import studentService from '@/lib/api/studentService';
import { Notification, useNotification } from '@/components/Notification';

interface PaymentData {
  reference: string;
  driver_id: string;
  driver_name: string;
  fare: number;
  route: string;
  vehicle: string;
  timestamp: string;
  expiresAt: string;
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loadUserData } = useAppState();
  const { notification, showNotification, clearNotification } = useNotification();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse payment data from URL
    const dataParam = searchParams?.get('data');
    
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        setPaymentData(decoded);
      } catch (err) {
        setError('Invalid payment data');
      }
    } else {
      setError('No payment data provided');
    }
  }, [searchParams]);

  useEffect(() => {
    // Load user data if authenticated
    if (isAuthenticated && user?.id) {
      loadUserData();
    }
  }, [isAuthenticated, user?.id]);

  const handlePayment = async () => {
    if (!isAuthenticated || !user?.id) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(window.location.href);
      router.push(`/student/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    if (!paymentData) {
      showNotification('error', 'Payment data missing');
      return;
    }

    // Check wallet balance
    const userBalance = user?.walletBalance || 0;
    if (userBalance < paymentData.fare) {
      showNotification('error', `Insufficient balance. Current: ${formatCurrency(userBalance)}, Required: ${formatCurrency(paymentData.fare)}`);
      return;
    }

    try {
      setIsProcessing(true);
      
      // Process QR payment
      const result = await studentService.payWithQR(
        user.id,
        paymentData.driver_id,
        paymentData.fare,
        paymentData.route,
        paymentData.reference
      );

      showNotification('success', 'Payment successful!');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 2000);
    } catch (err: any) {
      setIsProcessing(false);
      const errorMsg = err.response?.data?.message || err.message || 'Payment failed';
      showNotification('error', errorMsg);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-gray-200 px-4 py-4">
          <Logo className="h-8 mx-auto" />
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Invalid Payment Link</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all">
                Go to Home
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const hasEnoughBalance = isAuthenticated && user?.walletBalance ? (user.walletBalance >= paymentData.fare) : false;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-4">
        <Logo className="h-8 mx-auto" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
          {/* Success Banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={24} className="text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">QR Code Scanned</p>
              <p className="text-xs text-green-700">Ready to process payment</p>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-black to-gray-900 text-white p-6">
              <p className="text-xs opacity-80 mb-3 uppercase tracking-wider">Ride Details</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs opacity-70 mb-1">Driver</p>
                  <p className="font-light text-lg">{paymentData.driver_name}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1">Vehicle</p>
                  <p className="font-light">{paymentData.vehicle}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1">Route</p>
                  <p className="font-light">{paymentData.route}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Fare Amount</p>
                <p className="text-4xl font-bold text-black">{formatCurrency(paymentData.fare)}</p>
              </div>
            </div>
          </div>

          {/* User Balance (if authenticated) */}
          {isAuthenticated && user ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Balance</p>
                  <p className={`text-2xl font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(user.walletBalance || 0)}
                  </p>
                </div>
                {!hasEnoughBalance && (
                  <Link href="/student/wallet">
                    <button className="text-sm text-blue-600 hover:text-blue-700 underline">
                      Top up
                    </button>
                  </Link>
                )}
              </div>
              {!hasEnoughBalance && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-800">
                    You need {formatCurrency(paymentData.fare - (user.walletBalance || 0))} more to complete this payment.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <p className="text-sm text-blue-900 text-center mb-4">
                Please log in to complete the payment
              </p>
            </div>
          )}

          {/* Info Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-600 text-center">
              🔒 Secure payment powered by ShuttleUNN
            </p>
          </div>
        </div>
      </main>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePayment}
            disabled={isProcessing || (isAuthenticated && !hasEnoughBalance)}
            className="w-full bg-black text-white py-4 rounded-xl font-medium text-sm uppercase tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : isAuthenticated ? (
              <>
                Pay {formatCurrency(paymentData.fare)}
                <ArrowRight size={20} />
              </>
            ) : (
              <>
                Login to Pay
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>

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

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
