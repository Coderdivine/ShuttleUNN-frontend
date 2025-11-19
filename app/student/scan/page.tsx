'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { ChevronLeft, MapPin, Users, Clock, DollarSign, AlertCircle, CheckCircle, ArrowRight, Upload } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAppState } from '@/lib/AppContext';
import studentService from '@/lib/api/studentService';
import { Notification, useNotification } from '@/components/Notification';

interface ScannedData {
  reference: string;
  driver_id: string;
  driver_name: string;
  fare: number;
  route: string;
  vehicle: string;
  timestamp: string;
  expiresAt: string;
}

export default function StudentScanPage() {
  const router = useRouter();
  const { user, isLoading, error, clearError } = useAppState();
  const { notification, showNotification, clearNotification } = useNotification();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        alert(`Error: ${error}`);
        clearError();
      }, 100);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const qrText = event.target?.result as string;
        // In a real app, you'd decode the QR image. For now, assume the file contains JSON
        const data = JSON.parse(qrText);
        setScannedData(data);
        setCameraActive(false);
        setIsProcessing(false);
        showNotification('success', 'QR code scanned successfully!');
      } catch (err) {
        setIsProcessing(false);
        showNotification('error', 'Failed to parse QR code data');
      }
    };

    reader.readAsText(file);
  };

  const handleManualScan = (qrDataString: string) => {
    try {
      const data = JSON.parse(qrDataString);
      setScannedData(data);
      setCameraActive(false);
      showNotification('success', 'QR code scanned successfully!');
    } catch (err) {
      showNotification('error', 'Invalid QR code data');
    }
  };

  const handlePayment = async () => {
    if (!user?.id || !scannedData) {
      showNotification('error', 'User not authenticated or QR data missing');
      return;
    }

    // Check wallet balance
    const userBalance = user?.walletBalance || 0;
    if (userBalance < scannedData.fare) {
      showNotification('error', `Insufficient balance. Current: ${formatCurrency(userBalance)}, Required: ${formatCurrency(scannedData.fare)}`);
      return;
    }

    try {
      setIsPaymentProcessing(true);
      
      // Process QR payment
      const result = await studentService.payWithQR(
        user.id,
        scannedData.driver_id,
        scannedData.fare,
        scannedData.route,
        scannedData.reference
      );

      showNotification('success', 'Payment successful!');
      
      // Wait a moment then redirect to dashboard
      setTimeout(() => {
        setIsPaymentProcessing(false);
        router.push('/student/dashboard');
      }, 2000);
    } catch (err: any) {
      setIsPaymentProcessing(false);
      const errorMsg = err.response?.data?.message || err.message || 'Payment failed';
      showNotification('error', errorMsg);
    }
  };

  const handleReScan = () => {
    setScannedData(null);
    setCameraActive(false);
    setIsProcessing(false);
  };

  const hasEnoughBalance = user?.walletBalance && scannedData ? (user.walletBalance || 0) >= scannedData.fare : false;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between sticky top-0 z-40 bg-white">
        <Link href="/student/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-sm font-light uppercase tracking-wider">Scan Bus</h1>
        <div className="flex items-center gap-2 text-xs">
          <Link href="/driver/auth/login" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors font-light">
            Driver
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {!scannedData ? (
          <>
            {/* Camera View */}
            {cameraActive && (
              <div className="flex-1 relative bg-black overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/30" />

                {/* QR Frame - Centered */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-72 h-72">
                    {/* Main Frame */}
                    <div className="w-full h-full border-2 border-white/70 rounded-2xl shadow-2xl">
                      {/* Corner Indicators */}
                      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-3 border-l-3 border-white rounded-tl-lg" />
                      <div className="absolute -top-3 -right-3 w-6 h-6 border-t-3 border-r-3 border-white rounded-tr-lg" />
                      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-3 border-l-3 border-white rounded-bl-lg" />
                      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-3 border-r-3 border-white rounded-br-lg" />

                      {/* Scanning Line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-red-500 to-transparent animate-pulse" />
                    </div>

                    {/* Text Below Frame */}
                    <div className="absolute -bottom-16 left-0 right-0 text-center">
                      <p className="text-white text-sm font-light opacity-70">Position QR code in frame</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                  <p className="text-white text-sm text-center mb-4 font-light opacity-80">
                    Camera scanning coming soon. Use manual input below.
                  </p>
                  <button
                    onClick={() => setCameraActive(false)}
                    className="w-full bg-white text-black py-3 rounded-xl font-light text-sm uppercase tracking-wider hover:bg-gray-100 transition-all active:scale-[0.98]"
                  >
                    Enter QR Data Manually
                  </button>
                </div>
              </div>
            )}

            {!cameraActive && !scannedData && (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <AlertCircle size={56} className="text-gray-300 mb-6" />
                <h2 className="text-xl font-light text-center mb-3">Camera Not Available</h2>
                <p className="text-sm text-gray-500 text-center mb-8 max-w-sm">
                  Please enable camera access or paste QR code data below.
                </p>
                
                <div className="w-full max-w-md space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Paste QR Code Data</label>
                    <textarea
                      id="qrInput"
                      placeholder='{"reference":"QR-...","driver_name":"...","fare":200,...}'
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-mono"
                      rows={4}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const input = document.getElementById('qrInput') as HTMLTextAreaElement;
                      if (input?.value) handleManualScan(input.value);
                    }}
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-3 rounded-xl font-light text-sm uppercase tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isProcessing ? 'Processing...' : 'Scan QR Data'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Scan Results */}
            <div className="flex-1 overflow-y-auto">
              {/* Success Banner */}
              <div className="bg-green-50 border-b border-green-100 px-4 py-4 sm:px-6 flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">QR Code Scanned</p>
                  <p className="text-xs text-green-700">{scannedData.vehicle}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto pb-32">
                {/* Driver & Vehicle Info */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-black to-gray-900 text-white p-5 sm:p-6">
                    <p className="text-xs opacity-80 mb-3 uppercase tracking-wider">Ride Details</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs opacity-70 mb-1">Driver</p>
                        <p className="font-light text-lg">{scannedData.driver_name}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70 mb-1">Vehicle</p>
                        <p className="font-light">{scannedData.vehicle}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70 mb-1">Route</p>
                        <p className="font-light">{scannedData.route}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fare & Balance */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-2 divide-x">
                    {/* Fare */}
                    <div className="bg-gray-50 p-5 text-center">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Fare</p>
                      <p className="text-3xl font-bold text-black">{formatCurrency(scannedData.fare)}</p>
                    </div>
                    {/* Balance */}
                    <div className="bg-white p-5 text-center">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Your Balance</p>
                      <p className={`text-3xl font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(user?.walletBalance || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Balance Warning */}
                {!hasEnoughBalance && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Insufficient Balance</p>
                      <p className="text-xs text-red-700 mt-1">You need {formatCurrency((scannedData?.fare || 0) - (user?.walletBalance || 0))} more to complete this trip.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-6 grid grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
              <button
                onClick={handleReScan}
                disabled={isPaymentProcessing}
                className="px-4 py-3 border border-gray-200 rounded-xl font-light text-sm uppercase tracking-wider hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Rescan
              </button>
              <button
                onClick={handlePayment}
                disabled={isPaymentProcessing || !hasEnoughBalance}
                className="px-4 py-3 bg-black text-white rounded-xl font-light text-sm uppercase tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isPaymentProcessing ? 'Processing...' : 'Make Payment'}
              </button>
            </div>
          </>
        )}
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
