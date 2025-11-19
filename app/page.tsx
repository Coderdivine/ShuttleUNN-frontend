'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { Users, MapPin, Clock, Smartphone, ArrowRight, Menu, X, Zap, Shield, Gauge } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Logo className="h-8 sm:h-9" />
            <span className="hidden sm:inline text-base text-black">ShuttleUNN</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-700 hover:text-black transition-colors font-medium">
              Features
            </Link>
            <Link href="#routes" className="text-sm text-gray-700 hover:text-black transition-colors font-medium">
              Routes
            </Link>
            <Link href="/support" className="text-sm text-gray-700 hover:text-black transition-colors font-medium">
              Support
            </Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <Link href="/student/auth/login">
                <button className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
                  Student
                </button>
              </Link>
              <Link href="/driver/auth/login">
                <button className="text-sm font-medium text-white bg-black px-4 py-2 rounded-full hover:bg-gray-900 transition-colors">
                  Driver
                </button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-black py-2"
              >
                Features
              </Link>
              <Link 
                href="#routes" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-black py-2"
              >
                Routes
              </Link>
              <Link 
                href="/support" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-black py-2"
              >
                Support
              </Link>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link 
                  href="/student/auth/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-black py-2"
                >
                  Student Login
                </Link>
                <Link href="/driver/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full text-sm font-medium text-white bg-black px-4 py-2 rounded-full hover:bg-gray-900 transition-colors">
                    Driver Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full w-fit">
                  <div className="h-2 w-2 bg-black rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Smart Campus Mobility</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-tight">
                  Your Ride,<br />
                  <span className="text-gray-600">Simplified</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                  Fast, reliable shuttles across UNN campus. One tap to book, NFC to pay. No waiting, no hassle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/student/auth/register" className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-900 transition-all active:scale-95 flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight size={20} />
                  </button>
                </Link>
                <Link href="/guest" className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto bg-gray-100 text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-200 transition-all">
                    Explore as Guest
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-8 text-sm text-gray-600">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-9 w-9 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center border-2 border-white font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">1000+ rides daily</p>
                  <p className="text-gray-500">Trusted by UNN community</p>
                </div>
              </div>
            </div>

            {/* Right Visual - Minimalist Design */}
            <div className="hidden lg:block relative">
              <div className="relative h-96 w-full">
                {/* Background decorative elements */}
                <div className="absolute -top-20 -right-20 h-64 w-64 bg-gray-100 rounded-full opacity-50" />
                <div className="absolute -bottom-10 left-10 h-48 w-48 bg-gray-50 rounded-full opacity-60" />
                
                {/* Main card */}
                <div className="relative z-10 space-y-6">
                  {/* Phone mockup with minimal design */}
                  <div className="mx-auto w-64 h-80 bg-black rounded-3xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-40 bg-black rounded-b-2xl z-20" />
                    
                    {/* Phone screen */}
                    <div className="absolute inset-2 top-8 bg-white rounded-2xl flex flex-col items-center justify-center space-y-4 p-6">
                      <Smartphone size={40} className="text-gray-400" />
                      <div className="text-center space-y-2">
                        <p className="text-lg font-bold text-black">Ready to go</p>
                        <p className="text-xs text-gray-500">Tap card to payment</p>
                      </div>
                      <div className="h-8 w-20 bg-gray-100 rounded-full mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black">
                What Makes Us Different
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Purpose-built for campus. Built on reliability.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Zap,
                  title: 'Instant Booking',
                  description: 'Reserve your seat in seconds. Real-time availability updates.',
                },
                {
                  icon: Gauge,
                  title: 'Live Tracking',
                  description: 'Know exactly where your shuttle is and when it arrives at your stop.',
                },
                {
                  icon: Clock,
                  title: 'Reliable Schedules',
                  description: 'Consistent timing you can trust. Always depart and arrive on schedule.',
                },
                {
                  icon: Smartphone,
                  title: 'One-Tap Payment',
                  description: 'NFC card or mobile wallet. Secure and instant payment processing.',
                },
                {
                  icon: Shield,
                  title: 'Secure Rides',
                  description: 'Verified drivers and secure routes. Your safety is our priority.',
                },
                {
                  icon: Users,
                  title: '24/7 Support',
                  description: 'Help whenever you need it. Dedicated support team available anytime.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-2xl border border-gray-200 transition-all duration-300 hover:border-black hover:shadow-xl">
                  {/* Background animated gradient on hover */}
                  <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  
                  {/* Content */}
                  <div className="relative p-6 sm:p-8 z-10">
                    {/* Icon with animated background */}
                    <div className="inline-flex p-3 bg-gray-100 group-hover:bg-white transition-colors duration-300 rounded-xl mb-5">
                      <feature.icon size={24} className="text-gray-900 group-hover:text-black transition-colors duration-300" />
                    </div>
                    
                    {/* Title and description */}
                    <h3 className="font-bold text-gray-900 group-hover:text-white mb-3 text-lg transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-200 leading-relaxed transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    {/* Bottom accent line */}
                    <div className="mt-5 h-1 w-8 bg-gray-900 group-hover:bg-white transition-colors duration-300 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Routes Section */}
        <section id="routes" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black">
                Multiple Routes
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive coverage across all major campus areas. Choose your route, hop on.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: 'Town Route', desc: 'Ikpa Rd → Main Gate', stops: 5 },
                { name: 'Carpark Route', desc: 'Carpark → Faculty Area', stops: 4 },
                { name: 'Enugu Express', desc: 'Enugu → Campus Center', stops: 6 },
                { name: 'Campus Loop', desc: 'Circular route', stops: 8 },
              ].map((route, idx) => (
                <div key={idx} className="group p-6 sm:p-7 bg-gray-50 border border-gray-200 rounded-xl hover:border-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-white text-lg mb-1">{route.name}</h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-300">{route.desc}</p>
                    </div>
                    <MapPin size={20} className="text-gray-400 group-hover:text-white shrink-0 mt-1" />
                  </div>
                  <div className="h-1 w-full bg-gray-200 group-hover:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900 group-hover:bg-white rounded-full" style={{width: `${(route.stops / 8) * 100}%`}} />
                  </div>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 mt-3">{route.stops} stops</p>
                </div>
              ))}
            </div>

            {/* Map info */}
            <div className="mt-12 p-8 sm:p-12 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3">Coverage Map</h3>
              <p className="text-gray-600 max-w-2xl mb-6">
                Our shuttle network covers all major academic buildings, hostels, and facilities across UNN campus. Real-time updates ensure you never miss your ride.
              </p>
              <button className="inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all">
                View Full Map
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Ready to Ride?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                Join thousands of UNN students who trust ShuttleUNN for their daily campus mobility needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/student/auth/register">
                <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-bold text-base hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                  Start as Student
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/driver/auth/register">
                <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white hover:text-black transition-all">
                  Join as Driver
                </button>
              </Link>
            </div>

            <div className="pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-400">Have questions? <Link href="/support" className="text-white font-semibold hover:underline">Visit our support center</Link></p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div>
                <Logo className="h-8 mb-4" />
                <p className="text-sm text-gray-600 leading-relaxed">Smart shuttle system for UNN campus. Fast, reliable, secure.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link href="#features" className="hover:text-black transition-colors font-medium">Features</Link></li>
                  <li><Link href="#routes" className="hover:text-black transition-colors font-medium">Routes</Link></li>
                  <li><Link href="/support" className="hover:text-black transition-colors font-medium">Support</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
              <p>&copy; 2025 ShuttleUNN. Built with purpose for UNN.</p>
              <div className="flex gap-6 mt-6 sm:mt-0">
                <a href="#" className="text-gray-600 hover:text-black transition-colors font-medium">Twitter</a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors font-medium">Instagram</a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors font-medium">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        main > section:nth-child(2),
        main > section:nth-child(3),
        main > section:nth-child(4),
        main > section:nth-child(5) {
          animation: fadeIn 0.6s ease-out;
        }

        main > section:nth-child(1) h1 {
          animation: slideInLeft 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}
