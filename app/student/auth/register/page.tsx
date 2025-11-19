'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/AppContext';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Eye, EyeOff, UserCheck, ArrowRight } from 'lucide-react';

export default function StudentRegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAppState();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({
    regNumber: '',
    email: '',
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    department: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const validateStep1 = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.username.trim() || !formData.regNumber.trim() || !formData.department.trim()) {
      setLocalError('Please fill in all fields');
      return false;
    }
    if (formData.username.length < 3) {
      setLocalError('Username must be at least 3 characters');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.email.trim() || !formData.phone.trim() || !formData.password.trim()) {
      setLocalError('Please fill in all fields');
      return false;
    }
    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return false;
    }
    if (!/\d/.test(formData.password)) {
      setLocalError('Password must contain at least one number');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setLocalError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateStep2()) {
      return;
    }

    try {
      await register('student', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        regNumber: formData.regNumber,
        department: formData.department,
        password: formData.password,
      });
      router.push('/student/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      setLocalError(errorMsg);
    }
  };

  const displayError = localError || error;

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
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Create Account</h1>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black transition-all duration-500" style={{ width: `${(step / 2) * 100}%` }} />
            </div>
            <p className="text-sm text-gray-500 mt-3">Begin your shuttle journey</p>
          </div>

          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-5 animate-in">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="font-medium text-gray-900">Personal Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Tell us about yourself</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Input
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="johndoe_unn"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Registration Number"
                  type="text"
                  name="regNumber"
                  placeholder="2020/123456"
                  value={formData.regNumber}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Department"
                  type="text"
                  name="department"
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors active:scale-95 flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="text-sm text-gray-500 mt-1">Complete your account setup</p>
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="your.email@unn.edu.ng"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="+234 XXX XXX XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">At least 8 characters, mix of letters and numbers</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <UserCheck size={18} />
                    )}
                    {isLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-gray-600 pt-2">
              Already have an account?{' '}
              <Link href="/student/auth/login" className="text-black font-medium hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </main>

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
