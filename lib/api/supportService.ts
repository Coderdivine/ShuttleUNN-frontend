import api from '../axios';

export interface SupportRequest {
  user_id: string;
  userType: 'student' | 'driver';
  email: string;
  subject: string;
  message: string;
  category: 'technical' | 'payment' | 'booking' | 'general' | 'complaint';
  attachments?: string[];
}

export interface SupportResponse {
  support_id: string;
  user_id: string;
  userType: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportList {
  supports: SupportResponse[];
  total: number;
}

const supportService = {
  /**
   * Submit feedback or support request
   */
  async submitFeedback(data: SupportRequest): Promise<SupportResponse> {
    const response = await api.post<SupportResponse>('/v2/support/submit', data);
    return response.data;
  },

  /**
   * Get support request by ID
   */
  async getSupportRequest(supportId: string): Promise<SupportResponse> {
    const response = await api.get<SupportResponse>(`/v2/support/${supportId}`);
    return response.data;
  },

  /**
   * Get all support requests for a user
   */
  async getUserSupport(
    userId: string,
    limit: number = 20,
    skip: number = 0
  ): Promise<SupportList> {
    const response = await api.get<SupportList>(`/v2/support/user/${userId}`, {
      params: { limit, skip },
    });
    return response.data;
  },

  /**
   * Update support request status
   */
  async updateSupportStatus(supportId: string, status: string): Promise<SupportResponse> {
    const response = await api.put<SupportResponse>(`/v2/support/${supportId}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * Add response to support request
   */
  async respondToSupport(supportId: string, response_text: string): Promise<SupportResponse> {
    const response = await api.put<SupportResponse>(`/v2/support/${supportId}/respond`, {
      response: response_text,
    });
    return response.data;
  },

  /**
   * Get all support requests by category
   */
  async getSupportByCategory(
    category: string,
    limit: number = 20,
    skip: number = 0
  ): Promise<SupportList> {
    const response = await api.get<SupportList>('/v2/support/category/' + category, {
      params: { limit, skip },
    });
    return response.data;
  },

  /**
   * Get support statistics
   */
  async getSupportStats(): Promise<{
    total: number;
    pending: number;
    resolved: number;
    byCategory: Record<string, number>;
  }> {
    const response = await api.get<any>('/v2/support/stats');
    return response.data;
  },
};

export default supportService;
