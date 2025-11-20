'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { ArrowLeft, QrCode as QrCodeIcon, Building2, Copy, Check, RefreshCw } from 'lucide-react';
import { Notification, useNotification } from '@/components/Notification';
import { formatCurrency } from '@/lib/utils';
import { useAppState } from '@/lib/AppContext';
import QRCode from 'react-qr-code';
import driverService from '@/lib/api/driverService';

export default function TapPaymentPage() {
  const { user, isHydrated, userType } = useAppState();
  const { notification, showNotification, clearNotification } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState<'qrcode' | 'transfer'>('qrcode');
  const [copied, setCopied] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [fareAmount, setFareAmount] = useState(200);

  // Get driver info from context
  const busNumber = (user?.vehicleInfo as any)?.registrationNumber || (user?.vehicleInfo as any)?.plateNumber || 'N/A';
  const route = (user?.vehicleInfo as any)?.assignedRoute || 'No route assigned';
  const bankName = user?.bankDetails?.bankName || 'Not Set';
  const accountName = user?.bankDetails?.accountName || ((user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : 'Not Set');
  const accountNumber = user?.bankDetails?.accountNumber || 'Not Set';
  const hasBankDetails = !!(user?.bankDetails?.accountNumber && user?.bankDetails?.bankName && user?.bankDetails?.accountName);

  // Generate QR code on mount and when fare changes
  useEffect(() => {
    if (user?.id && paymentMethod === 'qrcode') {
      generateQRCode();
    }
  }, [user?.id, fareAmount, paymentMethod]);

  const generateQRCode = async () => {
    if (!user?.id) return;

    try {
      setIsGeneratingQR(true);
      const result = await driverService.generateQRCode(user.id, fareAmount, route);
      setQrData(result);
      setIsGeneratingQR(false);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to generate QR code');
      setIsGeneratingQR(false);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
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

      {/* Show loading screen while hydrating */}
      {!isHydrated ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        <>
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
            <QrCodeIcon size={18} />
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
              {/* Fare Amount Input */}
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">Set Fare Amount</label>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setFareAmount(Math.max(50, fareAmount - 50))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    -
                  </button>
                  <div className="bg-gray-50 rounded-xl px-6 py-3 min-w-[120px]">
                    <p className="text-2xl font-bold">{formatCurrency(fareAmount)}</p>
                  </div>
                  <button
                    onClick={() => setFareAmount(fareAmount + 50)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* QR Code Display */}
              {isGeneratingQR ? (
                <div className="bg-gray-100 rounded-xl p-8 mb-6 inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black" />
                </div>
              ) : qrData ? (
                <div className="bg-white rounded-2xl p-8 mb-6 inline-block shadow-xl border-2 border-gray-200">
                  <QRCode
                    value={`https://shuttle-unn-frontend.vercel.app/student/pay?data=${encodeURIComponent(JSON.stringify(qrData))}`}
                    size={320}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#000000"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-8 mb-6 inline-block">
                  <QrCodeIcon size={200} className="text-gray-400" />
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">Scan to Pay</h2>
              <p className="text-gray-600 mb-4">Student can scan with app or phone camera</p>
              
              {qrData && (
                <button
                  onClick={generateQRCode}
                  disabled={isGeneratingQR}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isGeneratingQR ? 'animate-spin' : ''} />
                  Refresh QR Code
                </button>
              )}
            </div>

            {qrData && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium">{qrData.driver_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{qrData.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{qrData.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-xs">{qrData.reference}</span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 text-center">
                ℹ️ QR code expires in 15 minutes. Refresh if needed.
              </p>
            </div>
          </div>
        )}

        {/* Bank Transfer View */}
        {paymentMethod === 'transfer' && (
          <div className="space-y-6">
            {!hasBankDetails ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                <div className="mb-4">
                  <Building2 size={48} className="mx-auto text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Bank Details Required</h3>
                <p className="text-amber-800 mb-4">
                  Please add your bank details to receive payments via bank transfer
                </p>
                <Link href="/driver/dashboard?editProfile=true">
                  <Button variant="primary" className="w-full max-w-xs mx-auto">
                    Add Bank Details
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
                <div className="text-center pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold mb-2">Bank Transfer Details</h2>
                  <p className="text-gray-600">Share these details with the student</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Bank Name</p>
                    <p className="text-lg font-semibold">{bankName}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Account Name</p>
                    <p className="text-lg font-semibold">{accountName}</p>
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
                    <p className="text-2xl font-bold font-mono">{accountNumber}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Amount to Receive</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(fareAmount)}</p>
                  </div>
                </div>
              </div>
            )}

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
              <p className="font-semibold">{busNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Current Route</p>
              <p className="font-semibold">{route}</p>
            </div>
          </div>
        </div>
      </main>
        </>
      )}

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
