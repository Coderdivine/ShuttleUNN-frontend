'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/AppContext';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Eye, EyeOff } from 'lucide-react';

export default function DriverLoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAppState();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.emailOrUsername.trim() || !formData.password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      // Determine if input is email or username
      const isEmail = formData.emailOrUsername.includes('@');
      const loginData = {
        [isEmail ? 'email' : 'username']: formData.emailOrUsername,
        password: formData.password,
      };

      await login('driver', loginData);
      router.push('/driver/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      
      // If account not found as driver, suggest trying student login
      if (errorMsg.includes('Driver not found') || errorMsg.includes('not found')) {
        setLocalError('Driver account not found. If you are a student, please use the student login page.');
      } else {
        setLocalError(errorMsg);
      }
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Logo className="h-8" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              DRIVER LOGIN
            </h1>
            <p className="text-gray-600">Access your driver dashboard</p>
          </div>

          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <Input
              label="Email or Username"
              type="text"
              name="emailOrUsername"
              placeholder="your.email@example.com or username"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
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
            </div>

            <Button type="submit" variant="primary" className="w-full uppercase font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed" size="lg" disabled={isLoading}>
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/driver/auth/register" className="text-black font-medium hover:underline">
                Register as Driver
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
