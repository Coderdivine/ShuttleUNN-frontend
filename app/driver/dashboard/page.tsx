'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { Home, Clock, LogOut, Menu, X, Ellipsis, Wallet, Smartphone, QrCode, MapPin, Watch, TrendingUp, Users, DollarSign, Zap, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import TransactionDetailModal from '@/components/TransactionDetailModal';
import ProfileModal from '@/components/ProfileModal';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAppState } from '@/lib/AppContext';
import { Notification, useNotification } from '@/components/Notification';
import paymentService, { Bank } from '@/lib/api/paymentService';

const paymentMethodIcons = {
  card: Wallet,
  phone: Smartphone,
  qrcode: QrCode,
  transfer: Zap,
};

function DriverDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userType, trips: appTrips, isLoading, error, isHydrated, getTrips, clearError, logout, updateProfile, loadUserData } = useAppState();
  const { notification, showNotification, clearNotification } = useNotification();
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      bankCode: '',
    },
  });
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);

  // Check for editProfile query param
  useEffect(() => {
    const editProfile = searchParams?.get('editProfile');
    if (editProfile === 'true') {
      setShowProfileModal(true);
    }
  }, [searchParams]);

  // Load profile data into form
  useEffect(() => {
    if (user) {
      setProfileFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bankDetails: {
          accountName: user.bankDetails?.accountName || '',
          accountNumber: user.bankDetails?.accountNumber || '',
          bankName: user.bankDetails?.bankName || '',
          bankCode: user.bankDetails?.bankCode || '',
        },
      });
      
      // Check if account is already verified
      if (user.bankDetails?.accountName && user.bankDetails?.accountNumber && user.bankDetails?.bankCode) {
        setAccountVerified(true);
      }
    }
  }, [user]);

  // Load banks when profile modal opens
  useEffect(() => {
    if (showProfileModal && banks.length === 0) {
      loadBanks();
    }
  }, [showProfileModal]);

  const loadBanks = async () => {
    try {
      setLoadingBanks(true);
      const bankList = await paymentService.getDriverBankList();
      setBanks(bankList);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to load banks');
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleVerifyAccount = async () => {
    const { accountNumber, bankCode } = profileFormData.bankDetails;
    
    if (!accountNumber || !bankCode) {
      showNotification('error', 'Please enter account number and select a bank');
      return;
    }

    if (accountNumber.length !== 10) {
      showNotification('error', 'Account number must be 10 digits');
      return;
    }

    try {
      setVerifyingAccount(true);
      const result = await paymentService.verifyDriverBankAccount(accountNumber, bankCode);
      
      // Auto-fill account name and update bank name
      const selectedBank = banks.find(b => b.code === bankCode);
      setProfileFormData({
        ...profileFormData,
        bankDetails: {
          ...profileFormData.bankDetails,
          accountName: result.accountName,
          bankName: selectedBank?.name || profileFormData.bankDetails.bankName,
        },
      });
      
      setAccountVerified(true);
      showNotification('success', `Account verified: ${result.accountName}`);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to verify account');
      setAccountVerified(false);
    } finally {
      setVerifyingAccount(false);
    }
  };

  // Redirect if not a driver (wait for hydration to complete)
  useEffect(() => {
    if (isHydrated && userType !== 'driver') {
      router.push('/');
    }
  }, [userType, router, isHydrated]);

  // Load driver trips on mount
  useEffect(() => {
    if (user?.id && userType === 'driver') {
      getTrips(50, 0).catch(err => {
        console.error('Failed to load trips:', err);
      });
    }
  }, [user?.id, userType, getTrips]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      showNotification('error', error);
      clearError();
    }
  }, [error, showNotification, clearError]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate bank details if provided
    const hasBankDetails = profileFormData.bankDetails.accountNumber || 
                           profileFormData.bankDetails.accountName ||
                           profileFormData.bankDetails.bankCode;
    
    if (hasBankDetails) {
      if (!profileFormData.bankDetails.accountNumber || profileFormData.bankDetails.accountNumber.length !== 10) {
        showNotification('error', 'Please enter a valid 10-digit account number');
        return;
      }
      if (!profileFormData.bankDetails.bankCode) {
        showNotification('error', 'Please select a bank');
        return;
      }
      if (!accountVerified) {
        showNotification('error', 'Please verify your account number first');
        return;
      }
    }
    
    try {
      setIsSubmittingProfile(true);
      await updateProfile({
        firstName: profileFormData.firstName,
        lastName: profileFormData.lastName,
        username: profileFormData.username,
        phone: profileFormData.phone,
        bankDetails: {
          accountName: profileFormData.bankDetails.accountName || undefined,
          accountNumber: profileFormData.bankDetails.accountNumber || undefined,
          bankName: profileFormData.bankDetails.bankName || undefined,
          bankCode: profileFormData.bankDetails.bankCode || undefined,
        },
      });
      
      // Reload user data to get updated bank details
      await loadUserData();
      
      showNotification('success', 'Profile updated successfully!');
      setIsSubmittingProfile(false);
      setShowProfileModal(false);
      // Clear editProfile query param
      router.replace('/driver/dashboard');
    } catch (err: any) {
      setIsSubmittingProfile(false);
      showNotification('error', err.message || 'Failed to update profile');
    }
  };

  const handleTransactionClick = (trip: any) => {
    setSelectedTransaction({
      ...trip,
      busNumber: (user?.vehicleInfo as any)?.plateNumber || trip.busNumber || 'N/A',
      amount: trip.fare || trip.amount,
      date: trip.createdAt || trip.date,
    });
    setShowDetailModal(true);
  };

  // Calculate today's trips and earnings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTrips = appTrips.filter(trip => {
    const tripDate = new Date(trip.createdAt);
    tripDate.setHours(0, 0, 0, 0);
    return tripDate.getTime() === today.getTime();
  });
  
  const todayEarnings = todayTrips.reduce((sum, trip) => sum + (trip.fare || 0), 0);

  // Calculate weekly stats (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyTrips = appTrips.filter(trip => {
    const tripDate = new Date(trip.createdAt);
    return tripDate >= sevenDaysAgo;
  });

  const weeklyEarnings = weeklyTrips.reduce((sum, trip) => sum + (trip.fare || 0), 0);
  const weeklyPassengers = weeklyTrips.length;

  // Get driver info
  const driverName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : 'Driver';
  const driverInitials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'D';
  const busNumber = (user?.vehicleInfo as any)?.plateNumber || 'N/A';
  const route = (user?.vehicleInfo as any)?.assignedRoute || 'No route assigned';

  // Show loading screen while hydrating
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

        <button 
          onClick={() => setShowProfileModal(true)}
          className="p-4 border-t border-gray-200 w-full hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
              {driverInitials}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{driverName}</p>
              <p className="text-xs text-gray-500">{busNumber}</p>
            </div>
            <Ellipsis size={18} className="text-gray-400" />
          </div>
        </button>
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

            <button 
              onClick={() => {
                setShowSidebar(false);
                setShowProfileModal(true);
              }}
              className="p-4 border-t border-gray-200 w-full hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                  {driverInitials}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{driverName}</p>
                  <p className="text-xs text-gray-500">{busNumber}</p>
                </div>
                <Ellipsis size={18} className="text-gray-400" />
              </div>
            </button>
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
            <p className="text-gray-600 text-xs sm:text-sm">{busNumber} • {route}</p>
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
              <p className="text-xl sm:text-2xl font-bold">{weeklyPassengers}</p>
              <p className="text-xs text-gray-500 mt-1">{weeklyTrips.length} trips</p>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-gray-600" />
                <p className="text-xs font-light text-gray-600">Weekly Earnings</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{formatCurrency(weeklyEarnings)}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>
          </div>

          {/* Process Payment Button */}
          <div className="space-y-3">
            {/* Tap to Pay Section */}
            {user?.bankDetails?.accountNumber ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Wallet size={16} className="text-white" />
                      </div>
                      <h3 className="font-medium text-green-900">Tap to Pay Enabled</h3>
                    </div>
                    <p className="text-xs text-green-800 mb-3">
                      {user.bankDetails.accountName || 'Account'} • {user.bankDetails.bankName}
                    </p>
                    <p className="text-xs text-green-700">
                      Account: ••••{user.bankDetails.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <Link href="/driver/tap">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                      Collect Payment
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                        <Wallet size={16} className="text-white" />
                      </div>
                      <h3 className="font-medium text-amber-900">Setup Tap to Pay</h3>
                    </div>
                    <p className="text-xs text-amber-800 mb-3">
                      Add your bank details to receive payments directly to your account.
                    </p>
                  </div>
                  <button 
                    onClick={() => router.push('/driver/dashboard?editProfile=true')}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors whitespace-nowrap"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            <Link href="/driver/tap">
              <button className="w-full bg-black text-white px-4 sm:px-6 py-2.5 rounded-lg font-light text-xs uppercase tracking-wider hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <Clock size={16} />
                Process Payment
              </button>
            </Link>
          </div>

          {/* Recent Trips */}
          <div>
            <h2 className="text-lg font-light mb-3">Recent Trips</h2>
            
            {/* Mobile: Card Layout - Scrollable */}
            <div className="lg:hidden">
              {isLoading ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-sm">Loading trips...</p>
                </div>
              ) : appTrips.slice(0, 10).length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-sm">No trips yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {appTrips.slice(0, 10).map((trip) => {
                    const PaymentIcon = paymentMethodIcons[trip.paymentMethod as keyof typeof paymentMethodIcons] || Wallet;
                    const tripDate = trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'N/A';
                    const tripTime = trip.createdAt ? new Date(trip.createdAt).toLocaleTimeString() : 'N/A';
                    
                    return (
                      <button
                        key={trip.booking_id}
                        onClick={() => handleTransactionClick(trip)}
                        className="w-full bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 hover:bg-gray-50 transition-all active:bg-gray-100 text-left"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Student Ride</p>
                            <p className="text-xs text-gray-600 mt-0.5">{tripDate}</p>
                          </div>
                          <p className="text-sm font-bold shrink-0">{formatCurrency(trip.fare || 0)}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <MapPin size={12} />
                          <span className="truncate">{trip.pickupStop?.stopName || 'N/A'} → {trip.dropoffStop?.stopName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{tripTime}</span>
                          <span>•</span>
                          <PaymentIcon size={12} />
                          <span className="capitalize">{trip.paymentMethod || 'wallet'}</span>
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
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                          Loading trips...
                        </td>
                      </tr>
                    ) : appTrips.slice(0, 10).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                          No trips yet
                        </td>
                      </tr>
                    ) : (
                      appTrips.slice(0, 10).map((trip) => {
                        const PaymentIcon = paymentMethodIcons[trip.paymentMethod as keyof typeof paymentMethodIcons] || Wallet;
                        const tripDate = trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'N/A';
                        const tripTime = trip.createdAt ? new Date(trip.createdAt).toLocaleTimeString() : 'N/A';
                        
                        return (
                          <tr
                            key={trip.booking_id}
                            onClick={() => handleTransactionClick(trip)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                          >
                            <td className="px-6 py-4 text-sm font-medium">Student</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{trip.pickupStop?.stopName || 'N/A'} → {trip.dropoffStop?.stopName || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">
                              <p>{tripDate}</p>
                              <p className="text-xs text-gray-500">{tripTime}</p>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <PaymentIcon size={14} className="text-gray-600" />
                                <span className="capitalize text-xs">{trip.paymentMethod || 'wallet'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-bold">{formatCurrency(trip.fare || 0)}</td>
                          </tr>
                        );
                      })
                    )}
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

      {/* Profile Edit Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={() => {
        setShowProfileModal(false);
        router.replace('/driver/dashboard');
      }}>
        <div className="text-sm text-gray-500 mb-8 font-light">
          Update your driver profile and bank details.
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            value={profileFormData.username}
            onChange={(e) => setProfileFormData({ ...profileFormData, username: e.target.value })}
            disabled={isSubmittingProfile || isLoading}
            required
          />

          <Input
            label="First Name"
            type="text"
            value={profileFormData.firstName}
            onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
            disabled={isSubmittingProfile || isLoading}
            required
          />

          <Input
            label="Last Name"
            type="text"
            value={profileFormData.lastName}
            onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
            disabled={isSubmittingProfile || isLoading}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={profileFormData.phone}
            onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
            disabled={isSubmittingProfile || isLoading}
            required
          />

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-1">Bank Details for Tap to Pay</h3>
            <p className="text-xs text-gray-600 mb-4">Add your bank account to receive payments directly</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={profileFormData.bankDetails.bankCode}
                  onChange={(e) => {
                    const selectedBank = banks.find(b => b.code === e.target.value);
                    setProfileFormData({ 
                      ...profileFormData, 
                      bankDetails: { 
                        ...profileFormData.bankDetails, 
                        bankCode: e.target.value,
                        bankName: selectedBank?.name || '',
                      }
                    });
                    setAccountVerified(false);
                  }}
                  disabled={isSubmittingProfile || isLoading || loadingBanks}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingBanks ? 'Loading banks...' : 'Select your bank'}
                  </option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="1234567890"
                    maxLength={10}
                    value={profileFormData.bankDetails.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setProfileFormData({ 
                        ...profileFormData, 
                        bankDetails: { ...profileFormData.bankDetails, accountNumber: value }
                      });
                      setAccountVerified(false);
                    }}
                    disabled={isSubmittingProfile || isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyAccount}
                    disabled={
                      isSubmittingProfile || 
                      isLoading || 
                      verifyingAccount || 
                      !profileFormData.bankDetails.accountNumber || 
                      !profileFormData.bankDetails.bankCode ||
                      profileFormData.bankDetails.accountNumber.length !== 10
                    }
                    className="px-4 py-2 whitespace-nowrap"
                  >
                    {verifyingAccount ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    Account Name
                    {accountVerified && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </span>
                </label>
                <Input
                  type="text"
                  placeholder="Account name will appear after verification"
                  value={profileFormData.bankDetails.accountName}
                  disabled={true}
                  className="bg-gray-50"
                />
              </div>

              {accountVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Account verified successfully
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmittingProfile || isLoading}
            >
              {isSubmittingProfile || isLoading ? 'UPDATING...' : 'SAVE CHANGES'}
            </Button>
          </div>
        </form>
      </ProfileModal>

      {/* Notification */}
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

export default function DriverDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <DriverDashboardContent />
    </Suspense>
  );
}
