'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import ProfileModal from '@/components/ProfileModal';
import TransactionDetailModal from '@/components/TransactionDetailModal';
import { Home, History, HelpCircle, LogOut, Menu, X, QrCode, User, Ellipsis, Wallet } from 'lucide-react';
import { dummyStats, dummyTransactions } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { useAppState } from '@/lib/AppContext';

type TabType = 'all' | 'upcoming' | 'active' | 'past';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, stats, updateUser } = useAppState();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sparkleClass, setSparkleClass] = useState('');
  const topUpButtonRef = useRef<HTMLButtonElement>(null);
  const [profileFormData, setProfileFormData] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    regNumber: user.regNumber,
  });
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Sparkle animation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkleClass('animate-sparkle');
      setTimeout(() => setSparkleClass(''), 600);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const filteredTransactions = dummyTransactions.filter((transaction) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'past') return true;
    if (activeTab === 'active') return false;
    if (activeTab === 'upcoming') return false
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Logo className="h-10" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-100 text-black font-medium"
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            href="/student/trips"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <History size={20} />
            My Trips
          </Link>
          <Link
            href="/student/scan"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <QrCode size={20} />
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

        <Link href="/student/dashboard" className="p-4 border-t border-gray-200 hover:bg-gray-50 transition-colors block">
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-100 text-black font-medium"
              >
                <Home size={20} />
                Home
              </Link>
              <Link
                href="/student/trips"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
              >
                <History size={20} />
                My Trips
              </Link>
              <Link
                href="/student/scan"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
              >
                <QrCode size={20} />
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
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Ellipsis size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-lg font-bold mb-0.5">
              Welcome back, @{user.username}
            </h1>
            <p className="text-gray-600 text-xs">Check your recent rides</p>
            <div className="mt-3 flex items-center justify-end">
              <Link href="/student/wallet">
                <button 
                  ref={topUpButtonRef}
                  className={`bg-black text-white px-3 py-1.5 rounded-full font-medium text-xs hover:bg-gray-800 transition-all flex items-center gap-1 ${sparkleClass}`}
                  style={{
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <Wallet size={14} />
                  <span className="hidden sm:inline">Top Up</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-5">
            {/* Wallet Balance Card - Black */}
            <div className="bg-black text-white rounded-lg sm:rounded-xl p-3">
              <p className="text-xs text-gray-300 mb-1">Wallet</p>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(user.walletBalance)}</p>
            </div>

            {/* Total Trips Card - White */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Trips</p>
              <p className="text-lg sm:text-2xl font-bold">{dummyStats.totalTrips}</p>
            </div>

            {/* Total Spent Card - White */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 border border-gray-200 col-span-2 lg:col-span-1">
              <p className="text-xs text-gray-600 mb-1">Total Spent</p>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(dummyStats.totalSpent)}</p>
            </div>
          </div>

          {/* Recent Rides Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex min-w-max">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  ALL RIDES
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    activeTab === 'past'
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  PAST RIDES
                </button>
              </div>
            </div>

            {/* Table Content */}
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-2xl font-bold mb-2">NO RECENT RIDES</p>
                <p className="text-gray-600 text-xs">Your ride history will appear here</p>
              </div>
            ) : (
              <>
                {/* Mobile: Card Layout */}
                <div className="lg:hidden space-y-2 p-4 max-h-96 overflow-y-auto">
                  {filteredTransactions.map((transaction) => (
                    <button
                      key={transaction.id}
                      onClick={() => handleTransactionClick(transaction)}
                      className="w-full bg-gray-50 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-100 hover:border-gray-300 transition-all active:bg-gray-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{transaction.id}</p>
                          <p className="text-xs text-gray-600 mt-1">{transaction.date}</p>
                        </div>
                        <p className="text-xs font-bold shrink-0">{formatCurrency(transaction.amount)}</p>
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-1">{transaction.route}</p>
                      <p className="text-xs text-gray-500">{transaction.busNumber} • {transaction.time}</p>
                    </button>
                  ))}
                </div>

                {/* Desktop: Table Layout */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Bus Number
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr 
                          key={transaction.id} 
                          onClick={() => handleTransactionClick(transaction)}
                          className="hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                        >
                          <td className="px-4 py-2 text-xs font-medium">{transaction.id}</td>
                          <td className="px-4 py-2 text-xs">
                            <div>{transaction.date}</div>
                            <div className="text-xs text-gray-500">{transaction.time}</div>
                          </td>
                          <td className="px-4 py-2 text-xs">{transaction.route}</td>
                          <td className="px-4 py-2 text-xs font-medium">{transaction.busNumber}</td>
                          <td className="px-4 py-2 text-xs font-bold">{formatCurrency(transaction.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-0 py-2 z-40 safe-bottom">
        <div className="flex items-center justify-around">
          <Link href="/student/dashboard" className="flex flex-col items-center gap-0.5 py-2 px-4">
            <Home size={20} className="text-black" />
            <span className="text-xs font-medium text-black">Home</span>
          </Link>
          <Link href="/student/trips" className="flex flex-col items-center gap-0.5 py-2 px-4 text-gray-400">
            <History size={20} />
            <span className="text-xs">Trips</span>
          </Link>
          <Link href="/student/wallet" className="flex flex-col items-center gap-0.5 py-2 px-4 text-gray-400">
            <Wallet size={20} />
            <span className="text-xs">Top Up</span>
          </Link>
          <button onClick={() => setShowProfileModal(true)} className="flex flex-col items-center gap-0.5 py-2 px-4 text-gray-400">
            <User size={20} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

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

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
