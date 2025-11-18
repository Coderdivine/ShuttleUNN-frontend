'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, Wallet, Smartphone, QrCode, Zap, Home, HelpCircle, LogOut, Menu, X, User, Ellipsis, ChevronLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import ProfileModal from '@/components/ProfileModal';
import { dummyTransactions } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import TransactionDetailModal from '@/components/TransactionDetailModal';
import { useAppState } from '@/lib/AppContext';

type FilterType = 'all' | 'thisWeek' | 'thisMonth' | 'lastMonth';

const paymentMethodIcons = {
  card: Wallet,
  phone: Smartphone,
  qrcode: QrCode,
  transfer: Zap,
};

export default function MyTripsPage() {
  const router = useRouter();
  const { user, updateUser } = useAppState();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    regNumber: user.regNumber,
  });
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  const handleLogout = () => {
    router.push('/');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateUser(profileFormData);
    setShowProfileModal(false);
    setIsSubmittingProfile(false);
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
  ];

  const handleTripClick = (trip: any) => {
    setSelectedTransaction(trip);
    setShowDetailModal(true);
  };

  const totalSpent = dummyTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Logo className="h-10" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            href="/student/trips"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-100 text-black font-medium"
          >
            <Clock size={20} />
            My Trips
          </Link>
          <Link
            href="/student/scan"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Wallet size={20} />
            Scan Bus
          </Link>
          <Link
            href="/support"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors w-full"
          >
            <HelpCircle size={20} />
            Support
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors w-full"
          >
            <LogOut size={20} />
            Log-out
          </button>
        </nav>

        <Link href="/student/trips" className="p-4 border-t border-gray-200 hover:bg-gray-50 transition-colors block">
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-full flex items-center gap-3 focus:outline-none"
          >
            <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.regNumber}</p>
            </div>
          </button>
        </Link>
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
                href="/student/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
              >
                <Home size={20} />
                Home
              </Link>
              <Link
                href="/student/trips"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-100 text-black font-medium"
              >
                <Clock size={20} />
                My Trips
              </Link>
              <Link
                href="/support"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors w-full"
              >
                <HelpCircle size={20} />
                Support
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors w-full"
              >
                <LogOut size={20} />
                Log-out
              </button>
            </nav>
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
          <Link href="/student/dashboard" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </Link>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-light mb-1">
              My Trips
            </h1>
            <p className="text-gray-600 text-sm">
              {dummyTransactions.length} rides recorded
            </p>
          </div>

          {/* Quick Stats - Mobile */}
          <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Total Spent</p>
              <p className="text-lg font-bold">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Avg. Fare</p>
              <p className="text-lg font-bold">{formatCurrency(Math.round(totalSpent / dummyTransactions.length))}</p>
            </div>
          </div>

          {/* Stats Bar - Desktop */}
          <div className="hidden lg:grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wider">Total Trips</p>
              <p className="text-2xl font-bold">{dummyTransactions.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wider">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wider">Average Fare</p>
              <p className="text-2xl font-bold">{formatCurrency(Math.round(totalSpent / dummyTransactions.length))}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  activeFilter === filter.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Trip List - Card Layout (Mobile & Tablet) */}
          <div className="space-y-3 lg:hidden">
            {dummyTransactions.map((trip) => {
              const PaymentIcon = paymentMethodIcons[trip.paymentMethod as keyof typeof paymentMethodIcons];
              return (
                <button
                  key={trip.id}
                  onClick={() => handleTripClick(trip)}
                  className="w-full bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-gray-300 hover:shadow-sm transition-all active:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm mb-1 truncate">{trip.route}</h3>
                      <p className="text-xs text-gray-600">{trip.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm">{formatCurrency(trip.amount)}</p>
                      <p className="text-xs text-green-600 font-medium capitalize">{trip.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <MapPin size={14} />
                    <span className="truncate">{trip.from} → {trip.to}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{trip.busNumber} • {trip.time}</span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <PaymentIcon size={14} />
                      <span className="capitalize">{trip.paymentMethod}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Trip List - Table Layout (Desktop) */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bus</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dummyTransactions.map((trip) => {
                  const PaymentIcon = paymentMethodIcons[trip.paymentMethod as keyof typeof paymentMethodIcons];
                  return (
                    <tr
                      key={trip.id}
                      onClick={() => handleTripClick(trip)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                    >
                      <td className="px-6 py-3 text-sm font-medium">{trip.route}</td>
                      <td className="px-6 py-3 text-sm">
                        <div>{trip.date}</div>
                        <div className="text-xs text-gray-500">{trip.time}</div>
                      </td>
                      <td className="px-6 py-3 text-sm font-medium">{trip.busNumber}</td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <PaymentIcon size={14} className="text-gray-600" />
                          <span className="capitalize text-xs">{trip.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-right">{formatCurrency(trip.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {dummyTransactions.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🚌</div>
              <h3 className="text-2xl font-bold mb-2">No trips yet</h3>
              <p className="text-gray-600 text-sm">Your ride history will appear here</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-0 py-2 z-40 safe-bottom">
        <div className="flex items-center justify-around">
          <Link href="/student/dashboard" className="flex flex-col items-center gap-0.5 py-2 px-4 text-gray-400">
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/student/trips" className="flex flex-col items-center gap-0.5 py-2 px-4">
            <Clock size={20} className="text-black" />
            <span className="text-xs font-medium text-black">Trips</span>
          </Link>
          <Link href="/student/wallet" className="flex flex-col items-center gap-0.5 py-2 px-4 text-gray-400">
            <Wallet size={20} />
            <span className="text-xs">Wallet</span>
          </Link>
          <button onClick={() => setShowProfileModal(true)} className="flex flex-col items-center gap-0.5 py-2 px-4 text-gray-400">
            <User size={20} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        transaction={selectedTransaction}
      />

      {/* Profile Edit Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
        <div className="text-xs text-gray-500 mb-6 font-light">
          Make changes to your profile.
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-light text-gray-600 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              value={profileFormData.regNumber}
              onChange={(e) => setProfileFormData({ ...profileFormData, regNumber: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-light"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-light text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              value={profileFormData.username}
              onChange={(e) => setProfileFormData({ ...profileFormData, username: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-light"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-light text-gray-600 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={profileFormData.firstName}
              onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-light"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-light text-gray-600 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={profileFormData.lastName}
              onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-light"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-light text-gray-600 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileFormData.phone}
              onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-light"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmittingProfile}
              className="w-full bg-black text-white px-6 py-3 rounded-full font-normal text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmittingProfile ? 'Updating...' : 'PROCEED'}
            </button>
          </div>
        </form>
      </ProfileModal>
    </div>
  );
}
