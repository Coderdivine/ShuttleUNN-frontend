'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Eye, EyeOff, UserCheck, ArrowRight } from 'lucide-react';

export default function StudentRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push('/student/dashboard');
  };

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
                  placeholder="johndoe_unn"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />

                <Input
                  label="Registration Number"
                  type="text"
                  placeholder="2020/123456"
                  value={formData.regNumber}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  required
                />

                <Input
                  label="Department"
                  type="text"
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                  <p className="text-sm text-gray-500 mt-1">Complete your account setup</p>
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@unn.edu.ng"
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
