import api from '../axios';

export interface RouteStop {
  stop_id: string;
  stopName: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface RouteResponse {
  route_id: string;
  routeName: string;
  routeCode: string;
  description?: string;
  stops: RouteStop[];
  distance: number;
  estimatedDuration: number;
  operatingHours: {
    startTime: string;
    endTime: string;
  };
  fare: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteRequest {
  routeName: string;
  routeCode: string;
  description?: string;
  stops: Array<{
    stopName: string;
    latitude: number;
    longitude: number;
  }>;
  distance: number;
  estimatedDuration: number;
  operatingHours: {
    startTime: string;
    endTime: string;
  };
  fare: number;
}

export interface UpdateRouteRequest extends Partial<CreateRouteRequest> {}

class RouteService {
  async getAllRoutes(limit: number = 20, skip: number = 0) {
    const response = await api.get<{
      routes: RouteResponse[];
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    }>('/v2/route', {
      params: { limit, skip },
    });
    return response.data;
  }

  async getRouteById(routeId: string) {
    const response = await api.get<RouteResponse>(`/v2/route/${routeId}`);
    return response.data;
  }

  async createRoute(data: CreateRouteRequest) {
    const response = await api.post<RouteResponse>('/v2/route', data);
    return response.data;
  }

  async updateRoute(routeId: string, data: UpdateRouteRequest) {
    const response = await api.put<RouteResponse>(`/v2/route/${routeId}`, data);
    return response.data;
  }

  async deleteRoute(routeId: string) {
    const response = await api.delete(`/v2/route/${routeId}`);
    return response.data;
  }

  async getRouteStops(routeId: string) {
    const response = await api.get<{
      route_id: string;
      routeName: string;
      routeCode: string;
      stops: RouteStop[];
    }>(`/v2/route/${routeId}/stops`);
    return response.data;
  }

  async addStop(routeId: string, stopData: { stopName: string; latitude: number; longitude: number }) {
    const response = await api.post<RouteResponse>(`/v2/route/${routeId}/stops`, stopData);
    return response.data;
  }

  async removeStop(routeId: string, stopId: string) {
    const response = await api.delete<RouteResponse>(`/v2/route/${routeId}/stops/${stopId}`);
    return response.data;
  }

  async searchRoutes(query: string, limit: number = 10, skip: number = 0) {
    const response = await api.get<{
      routes: RouteResponse[];
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    }>('/v2/route/search/query', {
      params: { query, limit, skip },
    });
    return response.data;
  }

  async getRoutesByStop(stopName: string, limit: number = 10, skip: number = 0) {
    const response = await api.get<{
      routes: RouteResponse[];
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    }>('/v2/route/search/by-stop', {
      params: { stopName, limit, skip },
    });
    return response.data;
  }
}

export default new RouteService();
