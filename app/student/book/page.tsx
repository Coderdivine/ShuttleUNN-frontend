'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { Notification, useNotification } from '@/components/Notification';
import { formatCurrency } from '@/lib/utils';
import { useAppState } from '@/lib/AppContext';

export default function BookPage() {
  const router = useRouter();
  const { notification, showNotification, clearNotification } = useNotification();
  const { routes, shuttles, isLoading, error, getRoutes, getShuttles, createBooking, confirmBooking, user, clearError } = useAppState();
  
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [selectedShuttle, setSelectedShuttle] = useState<any>(null);
  const [pickupStop, setPickupStop] = useState<any>(null);
  const [dropoffStop, setDropoffStop] = useState<any>(null);
  const [departureTime, setDepartureTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load routes on mount
  useEffect(() => {
    getRoutes(20, 0).catch(err => console.error('Failed to load routes:', err));
  }, [getRoutes]);

  // Load shuttles when route is selected
  useEffect(() => {
    if (selectedRoute?.route_id) {
      getShuttles(20, 0).catch(err => console.error('Failed to load shuttles:', err));
    }
  }, [selectedRoute, getShuttles]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      showNotification('error', error);
      clearError();
    }
  }, [error, showNotification, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoute || !selectedShuttle || !pickupStop || !dropoffStop || !departureTime || !user?.id) {
      showNotification('error', 'Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create booking
      const booking = await createBooking({
        shuttle_id: selectedShuttle.shuttle_id,
        route_id: selectedRoute.route_id,
        pickupStop: {
          stop_id: pickupStop.stop_id,
          stopName: pickupStop.stopName,
          pickupTime: `${departureTime}`,
        },
        dropoffStop: {
          stop_id: dropoffStop.stop_id,
          stopName: dropoffStop.stopName,
          estimatedArrivalTime: dropoffStop.estimatedArrivalTime || '14:00',
        },
        departureTime,
        fare: selectedRoute.fare || 0,
        paymentMethod,
      });

      // Confirm booking
      await confirmBooking(booking.booking_id, paymentMethod);

      setIsSubmitting(false);
      showNotification('success', 'Booking confirmed! Check your trips page for details.');
      setTimeout(() => router.push('/student/dashboard'), 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      showNotification('error', err.message || 'Failed to book shuttle');
    }
  };

  const filteredShuttles = selectedRoute 
    ? shuttles.filter((s: any) => s.route_id === selectedRoute.route_id)
    : [];

  const routeStops = selectedRoute?.stops || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/student/dashboard" className="flex items-center gap-3 text-gray-600 hover:text-black">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <Logo className="h-8" />
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">BOOK A SHUTTLE</h1>
          <p className="text-gray-600">Book your next ride with ease</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Route Selection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Select Route</h2>
            {isLoading ? (
              <p className="text-gray-600">Loading routes...</p>
            ) : routes.length === 0 ? (
              <p className="text-gray-600">No routes available</p>
            ) : (
              <div className="space-y-3">
                {routes.map((route: any) => (
                  <button
                    key={route.route_id}
                    type="button"
                    onClick={() => {
                      setSelectedRoute(route);
                      setSelectedShuttle(null);
                      setPickupStop(null);
                      setDropoffStop(null);
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedRoute?.route_id === route.route_id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{route.name}</h3>
                        <div className="flex items-center gap-2 text-sm mt-1">
                          <MapPin size={16} />
                          <span>{route.startPoint} → {route.endPoint}</span>
                        </div>
                        {route.stops && (
                          <div className="flex items-center gap-2 text-sm mt-1 opacity-75">
                            <Clock size={16} />
                            <span>{route.stops.length} stops</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{formatCurrency(route.fare)}</div>
                        <div className="text-xs opacity-75">per seat</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shuttle Selection */}
          {selectedRoute && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Select Shuttle</h2>
              {isLoading ? (
                <p className="text-gray-600">Loading shuttles...</p>
              ) : filteredShuttles.length === 0 ? (
                <p className="text-gray-600">No shuttles available for this route</p>
              ) : (
                <div className="space-y-3">
                  {filteredShuttles.map((shuttle: any) => (
                    <button
                      key={shuttle.shuttle_id}
                      type="button"
                      onClick={() => setSelectedShuttle(shuttle)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedShuttle?.shuttle_id === shuttle.shuttle_id
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{shuttle.plateNumber}</h3>
                          <p className="text-sm opacity-75">{shuttle.driver?.firstName} {shuttle.driver?.lastName}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{shuttle.availableSeats}/{shuttle.capacity} seats</div>
                          <div className="text-sm opacity-75">available</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stop Selection */}
          {selectedRoute && selectedShuttle && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Select Stops</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pickup Stop */}
                <div>
                  <label className="block text-sm font-bold mb-2">Pickup Stop</label>
                  <select
                    value={pickupStop?.stop_id || ''}
                    onChange={(e) => {
                      const stop = routeStops.find((s: any) => s.stop_id === e.target.value);
                      setPickupStop(stop);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                    required
                  >
                    <option value="">Select pickup stop...</option>
                    {routeStops.map((stop: any) => (
                      <option key={stop.stop_id} value={stop.stop_id}>
                        {stop.stopName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropoff Stop */}
                <div>
                  <label className="block text-sm font-bold mb-2">Dropoff Stop</label>
                  <select
                    value={dropoffStop?.stop_id || ''}
                    onChange={(e) => {
                      const stop = routeStops.find((s: any) => s.stop_id === e.target.value);
                      setDropoffStop(stop);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                    required
                  >
                    <option value="">Select dropoff stop...</option>
                    {routeStops.map((stop: any) => (
                      <option key={stop.stop_id} value={stop.stop_id}>
                        {stop.stopName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Date & Time */}
          {selectedRoute && selectedShuttle && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Schedule</h2>
              <Input
                label="Departure Time"
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
              />
            </div>
          )}

          {/* Payment Method */}
          {selectedRoute && selectedShuttle && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className="mb-2" size={24} />
                  <h3 className="font-bold">Wallet</h3>
                  <p className="text-xs opacity-75">From your wallet balance</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className="mb-2" size={24} />
                  <h3 className="font-bold">Card</h3>
                  <p className="text-xs opacity-75">Pay with your card</p>
                </button>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedRoute && selectedShuttle && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{selectedRoute.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shuttle:</span>
                  <span className="font-medium">{selectedShuttle.plateNumber}</span>
                </div>
                {pickupStop && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup:</span>
                    <span className="font-medium">{pickupStop.stopName}</span>
                  </div>
                )}
                {dropoffStop && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dropoff:</span>
                    <span className="font-medium">{dropoffStop.stopName}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total Fare:</span>
                  <span className="font-bold">{formatCurrency(selectedRoute.fare || 0)}</span>
                </div>
              </div>
            </div>
          )}

          {selectedRoute && selectedShuttle && (
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full uppercase font-semibold" 
              size="lg"
              disabled={!pickupStop || !dropoffStop || !departureTime || isSubmitting}
            >
              {isSubmitting ? 'BOOKING...' : 'CONFIRM BOOKING'}
            </Button>
          )}
        </form>
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
