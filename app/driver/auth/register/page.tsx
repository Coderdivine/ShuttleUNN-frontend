'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Eye, EyeOff, Truck, ArrowRight } from 'lucide-react';
import { Notification, useNotification } from '@/components/Notification';
import driverService from '@/lib/api/driverService';

export default function DriverRegisterPage() {
  const router = useRouter();
  const { notification, showNotification, clearNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    license: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleInfo: {
      registrationNumber: '',
      make: '',
      model: '',
      capacity: 0,
      color: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.vehicleInfo.registrationNumber || !formData.licenseNumber || !formData.licenseExpiry) {
        showNotification('error', 'Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Call the actual API
      await driverService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        license: formData.license,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        vehicleInfo: {
          registrationNumber: formData.vehicleInfo.registrationNumber,
          make: formData.vehicleInfo.make,
          model: formData.vehicleInfo.model,
          capacity: formData.vehicleInfo.capacity || 14,
          color: formData.vehicleInfo.color,
        },
      });

      showNotification('success', 'Driver registration successful! You can now login.');
      setTimeout(() => {
        setIsLoading(false);
        router.push('/driver/auth/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      showNotification('error', errorMsg);
      setIsLoading(false);
    }
  };

  const routes = [
    { id: 'town', label: 'Town Route (Ikpa Rd → UNN Main Gate)' },
    { id: 'carpark', label: 'Carpark Route (UNN Carpark → Faculty Area)' },
    { id: 'enugu', label: 'Enugu Express (Enugu → UNN)' },
    { id: 'campus', label: 'Campus Loop (Circular route within campus)' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-7 sm:h-8" />
          </Link>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">STEP {step}/2</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:py-12 flex items-center">
        <div className="w-full max-w-lg mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Register as Driver</h1>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black transition-all duration-500" style={{ width: `${(step / 2) * 100}%` }} />
            </div>
            <p className="text-sm text-gray-500 mt-3">Join our driver network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal & License */}
            {step === 1 && (
              <div className="space-y-5 animate-in">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="font-medium text-gray-900">Personal Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Your information</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />

                <Input
                  label="License Type"
                  type="text"
                  placeholder="e.g., Commercial Driver's License"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  required
                />

                <Input
                  label="Driver's License Number"
                  type="text"
                  placeholder="ABC123456789"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  required
                />

                <Input
                  label="License Expiry Date"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                  required
                />

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors active:scale-95 flex items-center justify-center gap-2 mt-8"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Contact & Security */}
            {step === 2 && (
              <div className="space-y-5 animate-in">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="font-medium text-gray-900">Contact & Security</h2>
                  <p className="text-sm text-gray-500 mt-1">Account credentials</p>
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />

                <div className="pb-4 border-b border-gray-100 mt-6">
                  <h2 className="font-medium text-gray-900">Vehicle Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Bus details</p>
                </div>

                <Input
                  label="Vehicle Registration Number"
                  type="text"
                  placeholder="ABC-123-XY"
                  value={formData.vehicleInfo.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleInfo: { ...formData.vehicleInfo, registrationNumber: e.target.value } })}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Vehicle Make"
                    type="text"
                    placeholder="Toyota"
                    value={formData.vehicleInfo.make}
                    onChange={(e) => setFormData({ ...formData, vehicleInfo: { ...formData.vehicleInfo, make: e.target.value } })}
                  />
                  <Input
                    label="Vehicle Model"
                    type="text"
                    placeholder="Hiace"
                    value={formData.vehicleInfo.model}
                    onChange={(e) => setFormData({ ...formData, vehicleInfo: { ...formData.vehicleInfo, model: e.target.value } })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Capacity"
                    type="number"
                    placeholder="14"
                    value={formData.vehicleInfo.capacity.toString()}
                    onChange={(e) => setFormData({ ...formData, vehicleInfo: { ...formData.vehicleInfo, capacity: parseInt(e.target.value) || 0 } })}
                  />
                  <Input
                    label="Color"
                    type="text"
                    placeholder="Yellow"
                    value={formData.vehicleInfo.color}
                    onChange={(e) => setFormData({ ...formData, vehicleInfo: { ...formData.vehicleInfo, color: e.target.value } })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">At least 8 characters, mix of letters and numbers</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-900">Your license will be verified by admin before activation</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Truck size={18} />
                    )}
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-gray-600 pt-2">
              Already have an account?{' '}
              <Link href="/driver/auth/login" className="text-black font-medium hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </main>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
