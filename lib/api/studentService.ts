import api from '../axios';

export interface StudentRegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  regNumber: string;
  department: string;
}

export interface StudentLoginData {
  email?: string;
  username?: string;
  password: string;
}

export interface StudentResponse {
  student_id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  regNumber: string;
  department: string;
  walletBalance: number;
  nfcCardId: string;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    bankCode?: string;
  };
  emailVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  transaction_id: string;
  student_id: string;
  amount: number;
  type: 'topup' | 'debit' | 'refund';
  paymentMethod: 'card' | 'phone' | 'qrcode' | 'transfer';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference: string;
  booking_id?: string;
  previousBalance: number;
  newBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopupWalletRequest {
  amount: number;
  paymentMethod: 'card' | 'phone' | 'qrcode' | 'transfer';
}

class StudentService {
  async register(data: StudentRegisterData) {
    const response = await api.post<{ data: StudentResponse }>('/v2/student/register', data);
    return response.data.data;
  }

  async login(data: StudentLoginData) {
    const response = await api.post<{ data: StudentResponse }>('/v2/student/login', data);
    return response.data.data;
  }

  async getProfile(studentId: string) {
    const response = await api.get<{ data: StudentResponse }>(`/v2/student/profile/${studentId}`);
    return response.data.data;
  }

  async updateProfile(studentId: string, data: Partial<StudentRegisterData>) {
    const response = await api.put<{ data: StudentResponse }>(`/v2/student/profile/${studentId}`, data);
    return response.data.data;
  }

  async changePassword(studentId: string, oldPassword: string, newPassword: string) {
    const response = await api.put<{ data: any }>(`/v2/student/change-password/${studentId}`, {
      oldPassword,
      newPassword,
    });
    return response.data.data;
  }

  async getWalletBalance(studentId: string) {
    const response = await api.get<{ data: { walletBalance: number } }>(`/v2/student/wallet/balance/${studentId}`);
    return response.data.data;
  }

  async topupWallet(studentId: string, data: TopupWalletRequest) {
    const response = await api.post<{
      data: {
        transaction: TransactionResponse;
        wallet: { student_id: string; walletBalance: number };
      }
    }>(`/v2/student/wallet/topup/${studentId}`, data);
    return response.data.data;
  }

  async debitWallet(studentId: string, amount: number, description: string, bookingId?: string) {
    const response = await api.post<{ data: any }>(`/v2/student/wallet/debit/${studentId}`, {
      amount,
      description,
      booking_id: bookingId,
    });
    return response.data.data;
  }

  async getTransactionHistory(studentId: string, limit: number = 20, skip: number = 0) {
    const response = await api.get<{
      data: {
        transactions: TransactionResponse[];
        total: number;
        limit: number;
        skip: number;
        hasMore: boolean;
      }
    }>(`/v2/student/transactions/${studentId}`, {
      params: { limit, skip },
    });
    return response.data.data;
  }

  async suspendAccount(studentId: string, reason?: string) {
    const response = await api.post<{ data: any }>(`/v2/student/suspend/${studentId}`, { reason });
    return response.data.data;
  }

  async unsuspendAccount(student_id: string): Promise<any> {
    const response = await api.post<{ data: any }>(`/v2/student/unsuspend/${student_id}`);
    return response.data.data;
  }

  // Paystack payment methods
  async initializePayment(student_id: string, amount: number, email: string): Promise<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }> {
    const response = await api.post<{ data: { authorization_url: string; access_code: string; reference: string } }>(
      `/v2/student/wallet/initialize-payment/${student_id}`,
      { amount, email }
    );
    return response.data.data;
  }

  async verifyPayment(reference: string): Promise<{
    message: string;
    transaction: any;
    wallet: { student_id: string; walletBalance: number };
    paymentDetails: any;
  }> {
    const response = await api.get<{ data: any }>(`/v2/student/wallet/verify-payment?reference=${reference}`);
    return response.data.data;
  }

  // QR Payment methods
  async scanQRCode(qrReference: string): Promise<any> {
    const response = await api.post<{ data: any }>('/v2/student/scan-qr', { qrReference });
    return response.data.data;
  }

  async payWithQR(student_id: string, driver_id: string, fare: number, route: string, qrReference: string): Promise<{
    message: string;
    transaction: any;
    wallet: { student_id: string; walletBalance: number };
    paymentDetails: any;
  }> {
    const response = await api.post<{ data: any }>(`/v2/student/pay-with-qr/${student_id}`, {
      driver_id,
      fare,
      route,
      qrReference,
    });
    return response.data.data;
  }

  // Get wallet transactions (top-ups only)
  async getWalletTransactions(student_id: string, limit: number = 20, offset: number = 0): Promise<{
    transactions: any[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }> {
    const response = await api.get<{ data: any }>(`/v2/student/wallet/transactions/${student_id}?limit=${limit}&offset=${offset}`);
    return response.data.data;
  }
}

export default new StudentService();
