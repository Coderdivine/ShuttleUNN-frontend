import api from '../axios';

export interface ShuttleResponse {
  shuttle_id: string;
  registrationNumber: string;
  make: string;
  model: string;
  capacity: number;
  currentPassengers: number;
  color?: string;
  assignedDriver?: string;
  assignedRoutes: Array<{ route_id: string }>;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
  };
  currentRoute?: string;
  status: 'available' | 'in-transit' | 'maintenance' | 'offline';
  maintenanceSchedule: Array<{
    type: string;
    scheduledDate: string;
    description?: string;
    status: 'scheduled' | 'completed';
    completedDate?: string;
  }>;
  totalDistance: number;
  totalTrips: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShuttleRequest {
  registrationNumber: string;
  make: string;
  model: string;
  capacity: number;
  color?: string;
}

export interface UpdateShuttleRequest extends Partial<CreateShuttleRequest> {}

class ShuttleService {
  async getAllShuttles(limit: number = 20, skip: number = 0) {
    const response = await api.get<{
      shuttles: ShuttleResponse[];
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    }>('/v2/shuttle', {
      params: { limit, skip },
    });
    return response.data;
  }

  async getAvailableShuttles(limit: number = 20, skip: number = 0) {
    const response = await api.get<{
      shuttles: ShuttleResponse[];
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    }>('/v2/shuttle/available', {
      params: { limit, skip },
    });
    return response.data;
  }

  async getShuttleDetails(shuttleId: string) {
    const response = await api.get<ShuttleResponse>(`/v2/shuttle/${shuttleId}`);
    return response.data;
  }

  async createShuttle(data: CreateShuttleRequest) {
    const response = await api.post<ShuttleResponse>('/v2/shuttle', data);
    return response.data;
  }

  async updateShuttle(shuttleId: string, data: UpdateShuttleRequest) {
    const response = await api.put<ShuttleResponse>(`/v2/shuttle/${shuttleId}`, data);
    return response.data;
  }

  async updateLocation(shuttleId: string, latitude: number, longitude: number) {
    const response = await api.put<{
      shuttle_id: string;
      currentLocation: {
        latitude: number;
        longitude: number;
        lastUpdated: string;
      };
    }>(`/v2/shuttle/${shuttleId}/location`, {
      latitude,
      longitude,
    });
    return response.data;
  }

  async assignDriver(shuttleId: string, driverId: string) {
    const response = await api.post<ShuttleResponse>(`/v2/shuttle/${shuttleId}/driver`, {
      driver_id: driverId,
    });
    return response.data;
  }

  async assignRoutes(shuttleId: string, routeIds: string[]) {
    const response = await api.post<ShuttleResponse>(`/v2/shuttle/${shuttleId}/routes`, {
      routeIds,
    });
    return response.data;
  }

  async updateCapacity(shuttleId: string, capacity: number) {
    const response = await api.put<ShuttleResponse>(`/v2/shuttle/${shuttleId}/capacity`, {
      capacity,
    });
    return response.data;
  }

  async updatePassengerCount(shuttleId: string, action: 'increment' | 'decrement') {
    const response = await api.put<{
      shuttle_id: string;
      currentPassengers: number;
      capacity: number;
    }>(`/v2/shuttle/${shuttleId}/passengers`, {
      action,
    });
    return response.data;
  }

  async addMaintenance(shuttleId: string, maintenanceData: {
    type: string;
    scheduledDate: string;
    description?: string;
  }) {
    const response = await api.post<ShuttleResponse>(`/v2/shuttle/${shuttleId}/maintenance`, maintenanceData);
    return response.data;
  }

  async completeMaintenance(shuttleId: string, maintenanceIndex: number) {
    const response = await api.put<ShuttleResponse>(`/v2/shuttle/${shuttleId}/maintenance/complete`, {
      maintenanceIndex,
    });
    return response.data;
  }

  async setCurrentRoute(shuttleId: string, routeId: string) {
    const response = await api.post<ShuttleResponse>(`/v2/shuttle/${shuttleId}/current-route`, {
      route_id: routeId,
    });
    return response.data;
  }

  async updateDistance(shuttleId: string, distanceInKm: number) {
    const response = await api.put<{
      shuttle_id: string;
      totalDistance: number;
    }>(`/v2/shuttle/${shuttleId}/distance`, {
      distanceInKm,
    });
    return response.data;
  }

  async incrementTrips(shuttleId: string) {
    const response = await api.post<{
      shuttle_id: string;
      totalTrips: number;
    }>(`/v2/shuttle/${shuttleId}/trips/increment`);
    return response.data;
  }

  async deactivateShuttle(shuttleId: string) {
    const response = await api.post(`/v2/shuttle/${shuttleId}/deactivate`);
    return response.data;
  }
}

export default new ShuttleService();
