import api from '../axios';

export interface DriverRegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  license: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleInfo: {
    registrationNumber: string;
    make: string;
    model: string;
    capacity: number;
    color?: string;
  };
}

export interface DriverLoginData {
  email?: string;
  username?: string;
  password: string;
}

export interface DriverResponse {
  driver_id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  license: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleInfo: {
    registrationNumber: string;
    make: string;
    model: string;
    capacity: number;
    color?: string;
  };
  assignedRoutes: Array<{ route_id: string }>;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    bankCode?: string;
  };
  rating: number;
  ratingCount: number;
  totalTrips: number;
  status: 'active' | 'inactive' | 'on-break' | 'offline';
  isActive: boolean;
  isSuspended: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

class DriverService {
  async register(data: DriverRegisterData) {
    const response = await api.post<{ data: DriverResponse }>('/v2/driver/register', data);
    return response.data.data;
  }

  async login(data: DriverLoginData) {
    const response = await api.post<{ data: DriverResponse }>('/v2/driver/login', data);
    return response.data.data;
  }

  async getProfile(driverId: string) {
    const response = await api.get<{ data: DriverResponse }>(`/v2/driver/profile/${driverId}`);
    return response.data.data;
  }

  async updateProfile(driverId: string, data: Partial<DriverRegisterData>) {
    const response = await api.put<{ data: DriverResponse }>(`/v2/driver/profile/${driverId}`, data);
    return response.data.data;
  }

  async changePassword(driverId: string, oldPassword: string, newPassword: string) {
    const response = await api.put<{ data: any }>(`/v2/driver/change-password/${driverId}`, {
      oldPassword,
      newPassword,
    });
    return response.data.data;
  }

  async updateStatus(driverId: string, status: 'active' | 'inactive' | 'on-break' | 'offline') {
    const response = await api.put<{ data: DriverResponse }>(`/v2/driver/status/${driverId}`, {
      status,
    });
    return response.data.data;
  }

  async getAssignedRoutes(driverId: string) {
    const response = await api.get<{
      data: {
        driver_id: string;
        assignedRoutes: Array<{ route_id: string }>;
      }
    }>(`/v2/driver/routes/${driverId}`);
    return response.data.data;
  }

  async assignRoutes(driverId: string, routeIds: string[]) {
    const response = await api.post<{ data: DriverResponse }>(`/v2/driver/routes/${driverId}`, {
      routeIds,
    });
    return response.data.data;
  }

  async updateRating(driverId: string, rating: number) {
    const response = await api.put<{
      data: {
        driver_id: string;
        rating: number;
        ratingCount: number;
      }
    }>(`/v2/driver/rating/${driverId}`, {
      rating,
    });
    return response.data.data;
  }

  async suspendAccount(driverId: string, reason?: string) {
    const response = await api.post<{ data: any }>(`/v2/driver/suspend/${driverId}`, {
      reason,
    });
    return response.data.data;
  }

  async unsuspendAccount(driver_id: string): Promise<any> {
    const response = await api.post<{ data: any }>(`/v2/driver/unsuspend/${driver_id}`);
    return response.data.data;
  }

  // QR Payment
  async generateQRCode(driver_id: string, fare: number, route: string): Promise<{
    reference: string;
    driver_id: string;
    driver_name: string;
    fare: number;
    route: string;
    vehicle: string;
    timestamp: string;
    expiresAt: string;
  }> {
    const response = await api.post<{ data: any }>(`/v2/driver/generate-qr/${driver_id}`, { fare, route });
    return response.data.data;
  }

  async getStats(driverId: string) {
    const response = await api.get<{
      data: {
        driver_id: string;
        totalEarnings: number;
        totalTrips: number;
        completedTrips: number;
        rating: number;
        ratingCount: number;
        status: string;
        vehicleInfo: any;
        assignedRoutes: any[];
      };
    }>(`/v2/driver/stats/${driverId}`);
    return response.data.data;
  }
}

export default new DriverService();
