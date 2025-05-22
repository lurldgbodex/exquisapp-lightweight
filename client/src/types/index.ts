export interface Transaction {
  id: string;
  paymentId: string;
  transactionType: 'deposit' | 'transfer';
  fromUserId: string;
  toUserId: string | null;
  amount: number;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}

export interface TransactionsResponse {
  deposits: Transaction[];
  transfers: Transaction[];
}
  
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}