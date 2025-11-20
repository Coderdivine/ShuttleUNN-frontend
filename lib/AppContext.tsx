'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import studentService, { StudentResponse, TransactionResponse } from './api/studentService';
import driverService, { DriverResponse } from './api/driverService';
import bookingService, { BookingResponse } from './api/bookingService';
import routeService, { RouteResponse } from './api/routeService';
import shuttleService, { ShuttleResponse } from './api/shuttleService';

export type UserType = 'student' | 'driver' | null;

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  walletBalance?: number;
  nfcCardId?: string;
  regNumber?: string; // Student only
  department?: string; // Student only
  licenseNumber?: string; // Driver only
  vehicleInfo?: any; // Driver only
  assignedRoute?: string; // Driver only - route name assigned to driver
  status?: string; // Driver only
  rating?: number; // Driver only
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    bankCode?: string;
  };
}

export interface AppStats {
  totalTrips: number;
  totalSpent: number;
  activeCard?: string;
  lastRide?: string;
  totalEarnings?: number; // Driver only
  completedTrips?: number; // Driver only
}

interface AppContextType {
  // Auth
  userType: UserType;
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;

  // Stats and data
  stats: AppStats | null;
  transactions: TransactionResponse[];
  bookings: BookingResponse[];
  trips: BookingResponse[];
  routes: RouteResponse[];
  shuttles: ShuttleResponse[];

  // Methods
  register: (type: 'student' | 'driver', data: any) => Promise<void>;
  login: (type: 'student' | 'driver', data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateWallet: (amount: number, paymentMethod?: string) => Promise<void>;
  verifyPayment: (reference: string) => Promise<{ success: boolean; message: string; newBalance?: number }>;
  getTransactionHistory: (limit?: number, skip?: number) => Promise<void>;
  getBookings: (limit?: number, skip?: number) => Promise<void>;
  getTrips: (limit?: number, skip?: number, status?: string) => Promise<void>;
  getRoutes: (limit?: number, skip?: number) => Promise<void>;
  assignRoutes: (routeIds: string[]) => Promise<any>;
  getShuttles: (limit?: number, skip?: number) => Promise<void>;
  getAvailableShuttles: (limit?: number, skip?: number) => Promise<void>;
  createBooking: (data: any) => Promise<BookingResponse>;
  confirmBooking: (bookingId: string, paymentMethod?: string) => Promise<BookingResponse>;
  rateTrip: (bookingId: string, rating: number, feedback?: string) => Promise<void>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  loadUserData: () => Promise<void>;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [trips, setTrips] = useState<BookingResponse[]>([]);
  const [routes, setRoutes] = useState<RouteResponse[]>([]);
  const [shuttles, setShuttles] = useState<ShuttleResponse[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    console.log('=== HYDRATION DEBUG ===');
    // Try loading from student storage first
    let savedUser = localStorage.getItem('appUser_student');
    let savedUserType: UserType = 'student';
    let token = localStorage.getItem('shuttleunn-token-student');
    
    // If no student data, try driver storage
    if (!savedUser || !token) {
      savedUser = localStorage.getItem('appUser_driver');
      savedUserType = 'driver';
      token = localStorage.getItem('shuttleunn-token-driver');
    }
    
    const savedStats = localStorage.getItem(`appStats_${savedUserType}`);
    const savedIsAuthenticated = localStorage.getItem(`isAuthenticated_${savedUserType}`) === 'true';

    console.log('Saved user string:', savedUser);
    console.log('Saved userType:', savedUserType);
    console.log('Saved isAuthenticated:', savedIsAuthenticated);
    console.log('Token exists:', !!token);

    if (token && savedUser && savedUserType && savedIsAuthenticated) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Parsed user object:', parsedUser);
        console.log('Parsed user username:', parsedUser.username);
        
        setUser(parsedUser);
        setUserType(savedUserType);
        setIsAuthenticated(true);
        if (savedStats) setStats(JSON.parse(savedStats));
        
        console.log('Hydration successful');
      } catch (err) {
        console.error('Hydration error:', err);
        // Clear only the current user type storage
        localStorage.removeItem(`appUser_${savedUserType}`);
        localStorage.removeItem(`userType`);
        localStorage.removeItem(`shuttleunn-token-${savedUserType}`);
        localStorage.removeItem(`isAuthenticated_${savedUserType}`);
        localStorage.removeItem(`appStats_${savedUserType}`);
        setIsAuthenticated(false);
      }
    } else {
      console.log('Hydration skipped - missing data');
      setIsAuthenticated(false);
    }
    setIsHydrated(true);
    console.log('=== END HYDRATION DEBUG ===');
  }, []);

  const register = useCallback(
    async (type: 'student' | 'driver', data: any) => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        if (type === 'student') {
          response = await studentService.register(data);
        } else {
          response = await driverService.register(data);
        }

        const appUser: AppUser = {
          id: (response as any).student_id || (response as any).driver_id,
          firstName: response.firstName,
          lastName: response.lastName,
          username: response.username,
          email: response.email,
          phone: response.phone,
          walletBalance: (response as any).walletBalance,
          nfcCardId: (response as any).nfcCardId,
          regNumber: (response as any).regNumber,
          department: (response as any).department,
          licenseNumber: (response as any).licenseNumber,
          vehicleInfo: (response as any).vehicleInfo,
          status: (response as any).status,
          rating: (response as any).rating,
        };

        setUser(appUser);
        setUserType(type);
        setIsAuthenticated(true);

        localStorage.setItem(`appUser_${type}`, JSON.stringify(appUser));
        localStorage.setItem('userType', type);
        localStorage.setItem(`isAuthenticated_${type}`, 'true');
        localStorage.setItem(`shuttleunn-token-${type}`, `Bearer ${(response as any).student_id || (response as any).driver_id}`);

        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const login = useCallback(
    async (type: 'student' | 'driver', data: any) => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        if (type === 'student') {
          response = await studentService.login(data);
        } else {
          response = await driverService.login(data);
        }

        console.log('=== LOGIN DEBUG ===');
        console.log('Full response from backend:', response);
        console.log('Username in response:', response.username);
        console.log('FirstName in response:', response.firstName);

        const appUser: AppUser = {
          id: (response as any).student_id || (response as any).driver_id,
          firstName: response.firstName,
          lastName: response.lastName,
          username: response.username,
          email: response.email,
          phone: response.phone,
          walletBalance: (response as any).walletBalance,
          nfcCardId: (response as any).nfcCardId,
          regNumber: (response as any).regNumber,
          department: (response as any).department,
          licenseNumber: (response as any).licenseNumber,
          vehicleInfo: (response as any).vehicleInfo,
          status: (response as any).status,
          rating: (response as any).rating,
        };

        console.log('AppUser object created:', appUser);
        console.log('Username in appUser:', appUser.username);

        setUser(appUser);
        setUserType(type);
        setIsAuthenticated(true);

        localStorage.setItem(`appUser_${type}`, JSON.stringify(appUser));
        localStorage.setItem('userType', type);
        localStorage.setItem(`isAuthenticated_${type}`, 'true');
        localStorage.setItem(`shuttleunn-token-${type}`, `Bearer ${(response as any).student_id || (response as any).driver_id}`);

        console.log('Saved to localStorage:', {
          appUser: JSON.parse(localStorage.getItem(`appUser_${type}`) || '{}'),
          userType: localStorage.getItem('userType'),
          isAuthenticated: localStorage.getItem(`isAuthenticated_${type}`)
        });
        console.log('=== END LOGIN DEBUG ===');

        // Load initial stats
        const initialStats: AppStats = {
          totalTrips: (response as any).totalTrips || 0,
          totalSpent: 0,
          activeCard: (response as any).nfcCardId,
          lastRide: (response as any).lastLogin,
          totalEarnings: (response as any).totalEarnings,
        };
        setStats(initialStats);
        localStorage.setItem(`appStats_${type}`, JSON.stringify(initialStats));

        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Login failed';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(() => {
    // Clear userType-specific storage
    if (userType === 'student') {
      localStorage.removeItem('appUser_student');
      localStorage.removeItem('shuttleunn-token-student');
      localStorage.removeItem('isAuthenticated_student');
      localStorage.removeItem('appStats_student');
    } else if (userType === 'driver') {
      localStorage.removeItem('appUser_driver');
      localStorage.removeItem('shuttleunn-token-driver');
      localStorage.removeItem('isAuthenticated_driver');
      localStorage.removeItem('appStats_driver');
    }
    localStorage.removeItem('userType');
    
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    setStats(null);
    setTransactions([]);
    setBookings([]);
  }, [userType]);

  const loadUserData = useCallback(async () => {
    if (!user?.id || !userType) return;

    try {
      setIsLoading(true);
      if (userType === 'student') {
        const profile = await studentService.getProfile(user.id);
        const appUser: AppUser = {
          id: profile.student_id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
          walletBalance: profile.walletBalance,
          nfcCardId: profile.nfcCardId,
          regNumber: profile.regNumber,
          department: profile.department,
        };
        setUser(appUser);
        localStorage.setItem(`appUser_${userType}`, JSON.stringify(appUser));

        // Load transactions
        const transactionData = await studentService.getTransactionHistory(user.id, 20, 0);
        setTransactions(transactionData.transactions);
        
        // Update stats - calculate from transactions
        const totalSpent = transactionData.transactions
          .filter((t: any) => t.type === 'debit')
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        
        setStats({
          totalTrips: 0, // Will be updated when trips are loaded
          totalSpent,
          activeCard: profile.nfcCardId || undefined,
        });
      } else {
        const profile = await driverService.getProfile(user.id);
        const appUser: AppUser = {
          id: profile.driver_id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
          status: profile.status,
          rating: profile.rating,
          licenseNumber: profile.licenseNumber,
          vehicleInfo: profile.vehicleInfo,
          bankDetails: profile.bankDetails,
        };

        // Fetch assigned routes (populated) so we can expose a single assignedRoute name/id for UI
        try {
          const assigned = await driverService.getAssignedRoutes(user.id);
          // assigned.assignedRoutes is an array where each item has { route_id: <Route doc> }
          if (assigned && Array.isArray(assigned.assignedRoutes) && assigned.assignedRoutes.length > 0) {
            const first = assigned.assignedRoutes[0];
            const routeDoc = first.route_id;
            // routeDoc may be populated object or an id string
            if (routeDoc && typeof routeDoc === 'object') {
              // Prefer storing the MongoDB _id for operations (fallback to route_id),
              // but keep a readable value in case only names are available.
              appUser.assignedRoute = routeDoc._id || routeDoc.route_id || routeDoc.routeName || null;
            } else if (routeDoc) {
              // not populated, fallback to route id string
              appUser.assignedRoute = routeDoc;
            }
          } else if (profile.assignedRoute) {
            // legacy single assignedRoute field
            appUser.assignedRoute = profile.assignedRoute;
          }
        } catch (assignErr) {
          console.warn('Failed to load assigned routes:', assignErr);
          if (profile.assignedRoute) appUser.assignedRoute = profile.assignedRoute;
        }

        setUser(appUser);
        localStorage.setItem(`appUser_${userType}`, JSON.stringify(appUser));

        // Fetch driver stats from backend
        try {
          const driverStats = await driverService.getStats(user.id);
          setStats({
            totalTrips: driverStats.totalTrips || 0,
            totalSpent: 0,
            totalEarnings: driverStats.totalEarnings || 0,
            completedTrips: driverStats.completedTrips || 0,
          });
        } catch (statsErr) {
          console.warn('Failed to load driver stats:', statsErr);
          setStats({
            totalTrips: 0,
            totalSpent: 0,
            totalEarnings: 0,
            completedTrips: 0,
          });
        }
      }
      setIsLoading(false);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load user data';
      setError(errorMsg);
      setIsLoading(false);
    }
  }, [user?.id, userType]);

  const updateProfile = useCallback(
    async (data: Partial<AppUser>) => {
      if (!user?.id || !userType) throw new Error('User not authenticated');

      try {
        setIsLoading(true);
        if (userType === 'student') {
          const response = await studentService.updateProfile(user.id, data);
          const updated: AppUser = {
            ...user,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            phone: response.phone,
            username: response.username,
            bankDetails: response.bankDetails,
          };
          setUser(updated);
          localStorage.setItem(`appUser_${userType}`, JSON.stringify(updated));
        } else {
          const response = await driverService.updateProfile(user.id, data);
          const updated: AppUser = {
            ...user,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            phone: response.phone,
            username: response.username,
            vehicleInfo: response.vehicleInfo || user.vehicleInfo,
            bankDetails: response.bankDetails,
          };
          setUser(updated);
          localStorage.setItem(`appUser_${userType}`, JSON.stringify(updated));
        }
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Profile update failed';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user, userType]
  );

    const assignRoutes = useCallback(
      async (routeIds: string[]) => {
        if (!user?.id || userType !== 'driver') throw new Error('Only drivers can be assigned routes');

        try {
          setIsLoading(true);
          const response = await driverService.assignRoutes(user.id, routeIds);

          // response is the updated driver object; set assignedRoute on user to first assigned route id if present
          const newAssigned =
            response?.assignedRoutes && response.assignedRoutes.length > 0
              ? (response.assignedRoutes[0].route_id && (response.assignedRoutes[0].route_id._id || response.assignedRoutes[0].route_id))
              : null;

          const updated: AppUser = {
            ...user,
            vehicleInfo: response.vehicleInfo || user.vehicleInfo,
            assignedRoute: newAssigned || user.assignedRoute,
          };
          setUser(updated);
          localStorage.setItem(`appUser_${userType}`, JSON.stringify(updated));
          setIsLoading(false);
          return response;
        } catch (err: any) {
          const errorMsg = err.response?.data?.message || 'Failed to assign routes';
          setError(errorMsg);
          setIsLoading(false);
          throw err;
        }
      },
      [user, userType]
    );

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      if (!user?.id || !userType) throw new Error('User not authenticated');

      try {
        setIsLoading(true);
        if (userType === 'student') {
          await studentService.changePassword(user.id, oldPassword, newPassword);
        } else {
          await driverService.changePassword(user.id, oldPassword, newPassword);
        }
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Password change failed';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user?.id, userType]
  );

  const updateWallet = useCallback(
    async (amount: number, paymentMethod: string = 'card') => {
      if (!user?.id || userType !== 'student') throw new Error('Only students can update wallet');
      if (!user?.email) throw new Error('User email is required');

      try {
        setIsLoading(true);
        
        // Initialize Paystack payment
        const paymentData = await studentService.initializePayment(user.id, amount, user.email);
        
        // Redirect to Paystack payment page
        if (paymentData.authorization_url) {
          window.location.href = paymentData.authorization_url;
        } else {
          throw new Error('Failed to initialize payment');
        }

        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Payment initialization failed';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user, userType, stats]
  );

  const verifyPayment = useCallback(
    async (reference: string): Promise<{ success: boolean; message: string; newBalance?: number }> => {
      // Wait for user and userType to be loaded
      if (!user?.id) {
        console.error('Payment verification failed: No user ID found');
        return { success: false, message: 'Session expired. Please log in again to complete payment verification.' };
      }
      
      if (userType !== 'student') {
        console.error('Payment verification failed: User is not a student, userType:', userType);
        return { success: false, message: 'Only students can verify payments' };
      }

      try {
        setIsLoading(true);
        console.log('Verifying payment for user:', user.id, 'reference:', reference);
        const result = await studentService.verifyPayment(reference);

        // Update user wallet balance
        const updated: AppUser = {
          ...user,
          walletBalance: result.wallet.walletBalance,
        };
        setUser(updated);
        localStorage.setItem(`appUser_${userType}`, JSON.stringify(updated));

        setIsLoading(false);
        return {
          success: true,
          message: result.message || 'Payment verified successfully',
          newBalance: result.wallet.walletBalance,
        };
      } catch (err: any) {
        console.error('Payment verification error:', err);
        const errorMsg = err.response?.data?.message || 'Payment verification failed';
        setError(errorMsg);
        setIsLoading(false);
        return { success: false, message: errorMsg };
      }
    },
    [user, userType]
  );

  const getTransactionHistory = useCallback(
    async (limit: number = 20, skip: number = 0) => {
      if (!user?.id || userType !== 'student') throw new Error('Only students can view transactions');

      try {
        setIsLoading(true);
        const data = await studentService.getTransactionHistory(user.id, limit, skip);
        setTransactions(data.transactions);
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load transactions';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user?.id, userType]
  );

  const getBookings = useCallback(
    async (limit: number = 10, skip: number = 0) => {
      if (!user?.id || userType !== 'student') throw new Error('Only students can view bookings');

      try {
        setIsLoading(true);
        const data = await bookingService.getStudentBookings(user.id, limit, skip);
        setBookings(data.bookings);
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load bookings';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user?.id, userType]
  );

  const getTrips = useCallback(
    async (limit: number = 10, skip: number = 0, status?: string) => {
      if (!user?.id) throw new Error('User not logged in');

      try {
        setIsLoading(true);

        if (userType === 'student') {
          // Students view their own trips
          const data = await bookingService.getStudentTrips(user.id, status, limit, skip);
          setTrips(data.trips);
        } else if (userType === 'driver') {
          // Drivers view all bookings (shuttle + QR payments)
          const data = await bookingService.getDriverBookings(user.id, limit, skip);
          setTrips(data.bookings);
        }

        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load trips';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user?.id, userType]
  );

  const getRoutes = useCallback(
    async (limit: number = 20, skip: number = 0) => {
      try {
        setIsLoading(true);
        const data = await routeService.getAllRoutes(limit, skip);
        setRoutes(data.routes || data);
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load routes';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const getShuttles = useCallback(
    async (limit: number = 20, skip: number = 0) => {
      try {
        setIsLoading(true);
        const data = await shuttleService.getAllShuttles(limit, skip);
        setShuttles(data.shuttles || data);
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load shuttles';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const getAvailableShuttles = useCallback(
    async (limit: number = 20, skip: number = 0) => {
      try {
        setIsLoading(true);
        const data = await shuttleService.getAvailableShuttles(limit, skip);
        setShuttles(data.shuttles || data);
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load available shuttles';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const createBooking = useCallback(
    async (data: any) => {
      if (!user?.id || userType !== 'student') throw new Error('Only students can create bookings');

      try {
        setIsLoading(true);
        const result = await bookingService.createBooking({
          ...data,
          student_id: user.id,
        });
        setIsLoading(false);
        return result;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to create booking';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user?.id, userType]
  );

  const confirmBooking = useCallback(
    async (bookingId: string, paymentMethod: string = 'card') => {
      if (!user?.id || userType !== 'student') throw new Error('Only students can confirm bookings');

      try {
        setIsLoading(true);
        const result = await bookingService.confirmBooking(bookingId, {
          paymentMethod: paymentMethod as any,
        });
        setIsLoading(false);
        return result;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to confirm booking';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user?.id, userType]
  );

  const rateTrip = useCallback(
    async (bookingId: string, rating: number, feedback?: string) => {
      if (!user?.id || userType !== 'student') throw new Error('Only students can rate trips');

      try {
        setIsLoading(true);
        await bookingService.rateBooking(bookingId, rating, feedback);
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to rate trip';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user?.id, userType]
  );

  const cancelBooking = useCallback(
    async (bookingId: string, reason?: string) => {
      if (!user?.id || userType !== 'student') throw new Error('Only students can cancel bookings');

      try {
        setIsLoading(true);
        await bookingService.cancelBooking(bookingId, reason);
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to cancel booking';
        setError(errorMsg);
        setIsLoading(false);
        throw err;
      }
    },
    [user?.id, userType]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userType,
        user,
        isAuthenticated,
        isLoading,
        error,
        isHydrated,
        stats,
        transactions,
        bookings,
        trips,
        routes,
        shuttles,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        updateWallet,
        verifyPayment,
        getTransactionHistory,
        getBookings,
        getTrips,
        getRoutes,
        getShuttles,
        getAvailableShuttles,
        createBooking,
        confirmBooking,
        rateTrip,
        cancelBooking,
        loadUserData,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

