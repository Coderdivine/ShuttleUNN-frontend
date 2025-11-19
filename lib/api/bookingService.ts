import api from '../axios';

export interface BookingRequest {
  student_id: string;
  shuttle_id: string;
  route_id: string;
  pickupStop: {
    stop_id: string;
    stopName: string;
    pickupTime: string;
  };
  dropoffStop: {
    stop_id: string;
    stopName: string;
    estimatedArrivalTime: string;
  };
  departureTime: string;
  fare: number;
  paymentMethod?: 'wallet' | 'card' | 'phone' | 'qrcode' | 'transfer';
  seatNumber?: number;
}

export interface BookingResponse {
  booking_id: string;
  student_id: string;
  shuttle_id: string;
  route_id: string;
  pickupStop: {
    stop_id: string;
    stopName: string;
    pickupTime: string;
  };
  dropoffStop: {
    stop_id: string;
    stopName: string;
    estimatedArrivalTime: string;
    actualArrivalTime?: string;
  };
  bookingTime: string;
  departureTime: string;
  arrivalTime?: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  fare: number;
  paymentMethod: 'wallet' | 'card' | 'phone' | 'qrcode' | 'transfer';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  seatNumber?: number;
  rating?: {
    score: number;
    feedback?: string;
    ratedAt: string;
  };
  cancellationReason?: string;
  cancellationTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingConfirmRequest {
  paymentMethod?: 'wallet' | 'card' | 'phone' | 'qrcode' | 'transfer';
}

class BookingService {
  async createBooking(data: BookingRequest) {
    const response = await api.post<BookingResponse>('/v2/booking', data);
    return response.data;
  }

  async confirmBooking(bookingId: string, data: BookingConfirmRequest) {
    const response = await api.post<BookingResponse>(`/v2/booking/${bookingId}/confirm`, data);
    return response.data;
  }

  async getBooking(bookingId: string) {
    const response = await api.get<BookingResponse>(`/v2/booking/${bookingId}`);
    return response.data;
  }

  async cancelBooking(bookingId: string, reason?: string) {
    const response = await api.post<BookingResponse>(`/v2/booking/${bookingId}/cancel`, {
      reason,
    });
    return response.data;
  }

  async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled') {
    const response = await api.put<BookingResponse>(`/v2/booking/${bookingId}/status`, {
      status,
    });
    return response.data;
  }

  async rateBooking(bookingId: string, rating: number, feedback?: string) {
    const response = await api.post<BookingResponse>(`/v2/booking/${bookingId}/rate`, {
      rating,
      feedback,
    });
    return response.data;
  }

  async getStudentBookings(studentId: string, limit: number = 10, skip: number = 0) {
    const response = await api.get<{
      bookings: BookingResponse[];
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    }>(`/v2/booking/student/${studentId}/bookings`, {
      params: { limit, skip },
    });
    return response.data;
  }

  async getStudentTrips(studentId: string, status?: string, limit: number = 10, skip: number = 0) {
    const response = await api.get<{
      trips: BookingResponse[];
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    }>(`/v2/booking/student/${studentId}/trips`, {
      params: { status, limit, skip },
    });
    return response.data;
  }

  async getShuttleBookings(shuttleId: string, limit: number = 20, skip: number = 0) {
    const response = await api.get<{
      bookings: BookingResponse[];
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    }>(`/v2/booking/shuttle/${shuttleId}/bookings`, {
      params: { limit, skip },
    });
    return response.data;
  }
}

export default new BookingService();
