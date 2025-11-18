'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  regNumber: string;
  department?: string;
  walletBalance: number;
  nfcCardId: string;
}

export interface AppStats {
  totalTrips: number;
  totalSpent: number;
  activeCard: string;
  lastRide: string;
}

interface AppContextType {
  user: AppUser;
  stats: AppStats;
  updateUser: (userData: Partial<AppUser>) => void;
  updateWallet: (amount: number) => void;
  addTrip: (amount: number) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>({
    firstName: 'Chimdi',
    lastName: 'Ezechukwu',
    username: '0x0000',
    email: 'student@unn.edu.ng',
    phone: '+2348150740406',
    regNumber: '2020/123456',
    department: 'Computer Science',
    walletBalance: 5000,
    nfcCardId: 'NFC-2024-001',
  });

  const [stats, setStats] = useState<AppStats>({
    totalTrips: 56,
    totalSpent: 11850,
    activeCard: 'NFC-2024-001',
    lastRide: '18th Nov, 2025',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('appUser');
    const savedStats = localStorage.getItem('appStats');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  const updateUser = (userData: Partial<AppUser>) => {
    const updated = { ...user, ...userData };
    setUser(updated);
    localStorage.setItem('appUser', JSON.stringify(updated));
  };

  const updateWallet = (amount: number) => {
    const newBalance = user.walletBalance + amount;
    const updated = { ...user, walletBalance: Math.max(0, newBalance) };
    setUser(updated);
    localStorage.setItem('appUser', JSON.stringify(updated));
  };

  const addTrip = (amount: number) => {
    const updated = {
      ...stats,
      totalTrips: stats.totalTrips + 1,
      totalSpent: stats.totalSpent + amount,
      lastRide: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    setStats(updated);
    localStorage.setItem('appStats', JSON.stringify(updated));
  };

  const loadFromStorage = () => {
    const savedUser = localStorage.getItem('appUser');
    const savedStats = localStorage.getItem('appStats');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedStats) setStats(JSON.parse(savedStats));
  };

  const saveToStorage = () => {
    localStorage.setItem('appUser', JSON.stringify(user));
    localStorage.setItem('appStats', JSON.stringify(stats));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        stats,
        updateUser,
        updateWallet,
        addTrip,
        loadFromStorage,
        saveToStorage,
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
