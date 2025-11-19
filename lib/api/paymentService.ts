import api from '../axios';

export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
}

export interface VerifyAccountResponse {
  accountNumber: string;
  accountName: string;
  bankCode: string;
}

class PaymentService {
  /**
   * Get list of Nigerian banks from Paystack
   */
  async getBankList(): Promise<Bank[]> {
    try {
      const response = await api.get('/v2/student/banks');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bank list');
    }
  }

  /**
   * Verify bank account number
   */
  async verifyBankAccount(accountNumber: string, bankCode: string): Promise<VerifyAccountResponse> {
    try {
      const response = await api.post('/v2/student/verify-account', {
        accountNumber,
        bankCode,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify account');
    }
  }

  /**
   * Get list of Nigerian banks from Paystack (Driver endpoint)
   */
  async getDriverBankList(): Promise<Bank[]> {
    try {
      const response = await api.get('/v2/driver/banks');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bank list');
    }
  }

  /**
   * Verify bank account number (Driver endpoint)
   */
  async verifyDriverBankAccount(accountNumber: string, bankCode: string): Promise<VerifyAccountResponse> {
    try {
      const response = await api.post('/v2/driver/verify-account', {
        accountNumber,
        bankCode,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify account');
    }
  }
}

export default new PaymentService();
