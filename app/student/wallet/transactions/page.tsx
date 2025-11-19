'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle, Clock, XCircle, RefreshCw, Receipt, Wallet } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAppState } from '@/lib/AppContext';
import studentService from '@/lib/api/studentService';
import { Notification, useNotification } from '@/components/Notification';
import Button from '@/components/Button';

type TopupTransaction = {
  transaction_id: string;
  student_id: string;
  amount: number;
  type: 'topup';
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  reference: string;
  previousBalance: number;
  newBalance: number;
  createdAt: string;
  updatedAt: string;
};

type TopupDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: TopupTransaction | null;
  onVerify: (reference: string) => void;
  isVerifying: boolean;
};

function TopupDetailModal({ isOpen, onClose, transaction, onVerify, isVerifying }: TopupDetailModalProps) {
  if (!isOpen || !transaction) return null;

  const statusColors = {
    completed: 'text-green-600',
    pending: 'text-yellow-600',
    failed: 'text-red-600',
  };

  const statusIcons = {
    completed: CheckCircle,
    pending: Clock,
    failed: XCircle,
  };

  const StatusIcon = statusIcons[transaction.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Top-up Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-center gap-2">
            <StatusIcon size={24} className={statusColors[transaction.status]} />
            <span className={`text-lg font-semibold uppercase ${statusColors[transaction.status]}`}>
              {transaction.status}
            </span>
          </div>

          {/* Amount */}
          <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-300 mb-2">Amount</p>
            <p className="text-3xl font-bold">{formatCurrency(transaction.amount)}</p>
          </div>

          {/* Balance Change */}
          {transaction.status === 'completed' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">Previous Balance</p>
                <p className="text-lg font-bold">{formatCurrency(transaction.previousBalance)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">New Balance</p>
                <p className="text-lg font-bold">{formatCurrency(transaction.newBalance)}</p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3 bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reference</span>
              <span className="font-mono text-xs font-semibold">{transaction.reference}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium capitalize">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">{formatDate(transaction.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-xs">{transaction.transaction_id.slice(0, 8)}...</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-700">{transaction.description}</p>
          </div>

          {/* Verify Button for Pending */}
          {transaction.status === 'pending' && (
            <Button
              onClick={() => onVerify(transaction.reference)}
              disabled={isVerifying}
              className="w-full"
              variant="primary"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} />
                  Verify Payment
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WalletTransactionsPage() {
  const router = useRouter();
  const { user, verifyPayment } = useAppState();
  const { notification, showNotification, clearNotification } = useNotification();
  const [transactions, setTransactions] = useState<TopupTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<TopupTransaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/student/auth/login');
      return;
    }
    loadTransactions();
  }, [user, router]);

  const loadTransactions = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const result = await studentService.getWalletTransactions(user.id, 50, 0);
      setTransactions(result.transactions);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async (reference: string) => {
    try {
      setIsVerifying(true);
      const result = await verifyPayment(reference);
      
      if (result.success) {
        showNotification('success', 'Payment verified successfully!');
        await loadTransactions(); // Reload transactions
        setShowDetailModal(false);
      } else {
        showNotification('error', result.message || 'Payment verification failed');
      }
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTransactionClick = (transaction: TopupTransaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const statusColors = {
    completed: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusIcons = {
    completed: CheckCircle,
    pending: Clock,
    failed: XCircle,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Top-up History</h1>
            <p className="text-xs text-gray-600">View all wallet top-up transactions</p>
          </div>
          <Wallet size={24} className="text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Receipt size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Top-up History</h2>
            <p className="text-sm text-gray-600 mb-6">You haven't made any wallet top-ups yet.</p>
            <Link href="/student/wallet">
              <Button variant="primary">Top Up Wallet</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const StatusIcon = statusIcons[transaction.status];
              
              return (
                <div
                  key={transaction.transaction_id}
                  onClick={() => handleTransactionClick(transaction)}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{formatCurrency(transaction.amount)}</p>
                      <p className="text-xs text-gray-600">{formatDate(transaction.createdAt)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusColors[transaction.status]}`}>
                      <StatusIcon size={12} />
                      {transaction.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Ref: {transaction.reference}</span>
                    <span className="font-medium capitalize">{transaction.paymentMethod}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <TopupDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        transaction={selectedTransaction}
        onVerify={handleVerifyPayment}
        isVerifying={isVerifying}
      />

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}

      {/* Bottom Navigation Spacer */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
