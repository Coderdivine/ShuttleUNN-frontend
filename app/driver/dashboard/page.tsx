'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { Home, Clock, LogOut, Menu, X, Ellipsis, Wallet, Smartphone, QrCode, MapPin, Watch, TrendingUp, Users, DollarSign, Zap } from 'lucide-react';
import { dummyDriver, dummyDriverTrips } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import TransactionDetailModal from '@/components/TransactionDetailModal';

const paymentMethodIcons = {
  card: Wallet,
  phone: Smartphone,
  qrcode: QrCode,
  transfer: Zap,
};

export default function DriverDashboard() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleLogout = () => {
    router.push('/');
  };

  const handleTransactionClick = (trip: any) => {
    setSelectedTransaction({
      ...trip,
      busNumber: dummyDriver.busNumber,
      amount: trip.fare,
      date: trip.date,
    });
    setShowDetailModal(true);
  };

  const todayTrips = dummyDriverTrips.filter(trip => trip.date === '17th November, 2025');
  const todayEarnings = todayTrips.reduce((sum, trip) => sum + trip.fare, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Logo className="h-10" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/driver/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-100 text-black font-medium"
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            href="/driver/tap"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Clock size={20} />
            Tap Payment
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors w-full mt-auto"
          >
            <LogOut size={20} />
            Log-out
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
              {dummyDriver.firstName[0]}{dummyDriver.lastName[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{dummyDriver.firstName} {dummyDriver.lastName}</p>
              <p className="text-xs text-gray-500">{dummyDriver.busNumber}</p>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Ellipsis size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <aside
            className="w-64 bg-white h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <Logo className="h-8" />
              <button onClick={() => setShowSidebar(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link
                href="/driver/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-100 text-black font-medium"
              >
                <Home size={20} />
                Home
              </Link>
              <Link
                href="/driver/tap"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
              >
                <Clock size={20} />
                Tap Payment
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors w-full"
              >
                <LogOut size={20} />
                Log-out
              </button>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                  {dummyDriver.firstName[0]}{dummyDriver.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{dummyDriver.firstName} {dummyDriver.lastName}</p>
                  <p className="text-xs text-gray-500">{dummyDriver.busNumber}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Bar - Mobile */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setShowSidebar(true)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={20} />
          </button>
          <Logo className="h-6" />
          <Link href="/student/auth/login" className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-xs font-light">
            Student
          </Link>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-20 lg:pb-0">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-light mb-1">
              Welcome back
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">{dummyDriver.busNumber} • {dummyDriver.route}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-black text-white rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} />
                <p className="text-xs font-light opacity-90">Today's Earnings</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{formatCurrency(todayEarnings)}</p>
              <p className="text-xs opacity-75 mt-1">{todayTrips.length} trips</p>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-gray-600" />
                <p className="text-xs font-light text-gray-600">Weekly Passengers</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{dummyDriver.weeklyStats.totalPassengers}</p>
              <p className="text-xs text-gray-500 mt-1">{dummyDriver.weeklyStats.tripsMade} trips</p>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-gray-600" />
                <p className="text-xs font-light text-gray-600">Weekly Earnings</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{formatCurrency(dummyDriver.weeklyStats.totalEarnings)}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>
          </div>

          {/* Process Payment Button */}
          <Link href="/driver/tap">
            <button className="w-full bg-black text-white px-4 sm:px-6 py-2.5 rounded-lg font-light text-xs uppercase tracking-wider hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Clock size={16} />
              Process Payment
            </button>
          </Link>

          {/* Recent Trips */}
          <div>
            <h2 className="text-lg font-light mb-3">Recent Trips</h2>
            
            {/* Mobile: Card Layout - Scrollable */}
            <div className="lg:hidden">
              {dummyDriverTrips.slice(0, 10).length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-sm">No trips yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {dummyDriverTrips.slice(0, 10).map((trip) => {
                    const PaymentIcon = paymentMethodIcons[trip.paymentMethod as keyof typeof paymentMethodIcons];
                    return (
                      <button
                        key={trip.id}
                        onClick={() => handleTransactionClick(trip)}
                        className="w-full bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 hover:bg-gray-50 transition-all active:bg-gray-100 text-left"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{trip.studentName}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{trip.date}</p>
                          </div>
                          <p className="text-sm font-bold shrink-0">{formatCurrency(trip.fare)}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <MapPin size={12} />
                          <span className="truncate">{trip.from} → {trip.to}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{trip.time}</span>
                          <span>•</span>
                          <PaymentIcon size={12} />
                          <span className="capitalize">{trip.paymentMethod}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop: Table Layout */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dummyDriverTrips.slice(0, 10).map((trip) => {
                      const PaymentIcon = paymentMethodIcons[trip.paymentMethod as keyof typeof paymentMethodIcons];
                      return (
                        <tr
                          key={trip.id}
                          onClick={() => handleTransactionClick(trip)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                        >
                          <td className="px-6 py-4 text-sm font-medium">{trip.studentName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{trip.from} → {trip.to}</td>
                          <td className="px-6 py-4 text-sm">
                            <p>{trip.date}</p>
                            <p className="text-xs text-gray-500">{trip.time}</p>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <PaymentIcon size={14} className="text-gray-600" />
                              <span className="capitalize text-xs">{trip.paymentMethod}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-bold">{formatCurrency(trip.fare)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-0 py-2 z-40">
        <div className="flex items-center justify-around">
          <Link href="/driver/dashboard" className="flex flex-col items-center gap-0.5 py-2 px-4">
            <Home size={20} className="text-black" />
            <span className="text-xs font-medium text-black">Home</span>
          </Link>
          <Link href="/driver/tap" className="flex flex-col items-center gap-0.5 py-2 px-4 text-gray-400">
            <Clock size={20} />
            <span className="text-xs">Tap</span>
          </Link>
          <button className="flex flex-col items-center gap-0.5 py-2 px-4 text-gray-400">
            <Ellipsis size={20} />
            <span className="text-xs">More</span>
          </button>
        </div>
      </nav>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
