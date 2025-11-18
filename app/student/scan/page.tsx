'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { ChevronLeft, MapPin, Users, Clock, DollarSign, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { dummyDriver } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { useAppState } from '@/lib/AppContext';

interface ScannedData {
  busNumber: string;
  driverId: string;
  route: string;
  from: string;
  to: string;
  fare: number;
  duration: string;
}

const mockScannedData: ScannedData = {
  busNumber: 'UNN-BUS-12',
  driverId: 'DRV-2024-001',
  route: 'Ikpa Road - UNN Main Gate',
  from: 'Ikpa Road Junction',
  to: 'UNN Main Gate',
  fare: 200,
  duration: '15 mins',
};

export default function StudentScanPage() {
  const router = useRouter();
  const { user, stats, updateWallet, addTrip } = useAppState();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleSimulatedScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setScannedData(mockScannedData);
      setCameraActive(false);
      setIsProcessing(false);
    }, 1500);
  };

  const handleProceed = () => {
    setIsProcessing(true);
    // Deduct from wallet and add trip
    setTimeout(() => {
      updateWallet(-mockScannedData.fare);
      addTrip(mockScannedData.fare);
      router.push(`/student/dashboard?trip=completed`);
    }, 1500);
  };

  const handleReScan = () => {
    setScannedData(null);
    setCameraActive(true);
    setIsProcessing(false);
  };

  const hasEnoughBalance = user.walletBalance >= mockScannedData.fare;

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
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/80 to-transparent p-6">
                  <button
                    onClick={handleSimulatedScan}
                    disabled={isProcessing}
                    className="w-full bg-white text-black py-3 rounded-xl font-light text-sm uppercase tracking-wider hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isProcessing ? 'Scanning...' : 'Tap to Scan'}
                  </button>
                </div>
              </div>
            )}

            {!cameraActive && !scannedData && (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <AlertCircle size={56} className="text-gray-300 mb-6" />
                <h2 className="text-xl font-light text-center mb-3">Camera Not Available</h2>
                <p className="text-sm text-gray-500 text-center mb-8 max-w-sm">
                  Please enable camera access or use the simulate scan button below.
                </p>
                <button
                  onClick={handleSimulatedScan}
                  disabled={isProcessing}
                  className="w-full max-w-xs bg-black text-white py-3 rounded-xl font-light text-sm uppercase tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isProcessing ? 'Scanning...' : 'Simulate Scan'}
                </button>
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
                  <p className="text-sm font-medium text-green-900">Bus Detected</p>
                  <p className="text-xs text-green-700">{scannedData.busNumber}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto pb-32">
                {/* Route Card */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-linear-to-r from-black to-gray-900 text-white p-5 sm:p-6">
                    <p className="text-xs opacity-80 mb-3 uppercase tracking-wider">Route</p>
                    <div className="space-y-4">
                      {/* From */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs opacity-70 mb-1">From</p>
                          <p className="font-light">{scannedData.from}</p>
                        </div>
                      </div>

                      {/* Connector */}
                      <div className="flex justify-center">
                        <div className="w-1 h-6 bg-white/30" />
                      </div>

                      {/* To */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                          <ArrowRight size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs opacity-70 mb-1">To</p>
                          <p className="font-light">{scannedData.to}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bus & Driver Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Bus Card */}
                  <div className="border border-gray-200 rounded-2xl p-5">
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Bus</p>
                    <p className="text-2xl font-bold mb-3">{scannedData.busNumber}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={14} />
                      {scannedData.duration}
                    </div>
                  </div>

                  {/* Driver Card */}
                  <div className="border border-gray-200 rounded-2xl p-5">
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Driver</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                        {dummyDriver.firstName[0]}{dummyDriver.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-light truncate">{dummyDriver.firstName} {dummyDriver.lastName}</p>
                        <p className="text-xs text-gray-500">{dummyDriver.licenseNumber}</p>
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
                        {formatCurrency(user.walletBalance)}
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
                      <p className="text-xs text-red-700 mt-1">You need {formatCurrency(scannedData.fare - user.walletBalance)} more to complete this trip.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-6 grid grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
              <button
                onClick={handleReScan}
                disabled={isProcessing}
                className="px-4 py-3 border border-gray-200 rounded-xl font-light text-sm uppercase tracking-wider hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Rescan
              </button>
              <button
                onClick={handleProceed}
                disabled={isProcessing || !hasEnoughBalance}
                className="px-4 py-3 bg-black text-white rounded-xl font-light text-sm uppercase tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
