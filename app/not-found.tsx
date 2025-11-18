import Link from 'next/link';
import Logo from '@/components/Logo';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <Logo className="h-8" />
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Large 404 */}
          <div className="relative">
            <h1 className="text-[200px] sm:text-[250px] font-bold text-gray-100 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Page Not Found</h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  The page you're looking for doesn't exist
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-8">
            <Link href="/">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all active:scale-95">
                <Home size={18} />
                Go Home
              </button>
            </Link>
            <Link href="/student/dashboard">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                <ArrowLeft size={18} />
                Go Back
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
