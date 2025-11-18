'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Mail, MapPin, HelpCircle, Twitter, Instagram, Linkedin } from 'lucide-react';
import Logo from '@/components/Logo';
import { Notification, useNotification } from '@/components/Notification';

export default function SupportPage() {
  const { notification, showNotification, clearNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.email && formData.message) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showNotification('success', 'Message sent! We will get back to you soon.');
      setFormData({ firstName: '', email: '', message: '' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/student/dashboard" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </Link>
          <Logo className="h-6 sm:h-7" />
          <div className="flex items-center gap-2">
            <Link href="/student/auth/login" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-xs font-light">
              Student
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/driver/auth/login" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-xs font-light">
              Driver
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Section - Contact Info */}
          <div className="flex flex-col justify-start lg:justify-center">
            <div className="mb-8 sm:mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
                Get in Touch
              </h1>
              <p className="text-gray-600 text-sm sm:text-base font-light mt-2">
                We're here to help and answer any question you might have.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4 sm:space-y-5">
              {/* Email */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Email</h3>
                    <a 
                      href="mailto:hello@thegarage.ng" 
                      className="text-sm text-gray-600 hover:text-black transition-colors font-light break-all"
                    >
                      hello@thegarage.ng
                    </a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      The Garage, Shop E2<br />
                      Students Union Building<br />
                      University of Nigeria<br />
                      Nsukka, Enugu State
                    </p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Follow Us</h3>
                <div className="flex items-center gap-2">
                  <a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                    aria-label="Twitter"
                  >
                    <Twitter size={16} />
                  </a>
                  <a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} />
                  </a>
                  <a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="flex flex-col justify-start lg:justify-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-7">
              <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-5">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* First Name */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 font-light mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all font-light placeholder-gray-400"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 font-light mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all font-light placeholder-gray-400"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 font-light mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all resize-none font-light placeholder-gray-400"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-light text-xs sm:text-sm uppercase tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

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
