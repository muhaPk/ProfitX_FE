export interface BitcoinAddress {
  id: string;
  address: string;
  userId: string;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BitcoinTransaction {
  id: string;
  addressId: string;
  txHash: string;
  amount: number; // in satoshis
  confirmations: number;
  blockHeight?: number;
  timestamp: string;
  type: 'received' | 'sent';
  status: 'pending' | 'confirmed' | 'failed';
}

export interface BitcoinBalance {
  address: string;
  balance: number; // in satoshis
  confirmedBalance: number; // in satoshis
  unconfirmedBalance: number; // in satoshis
  lastUpdated: string;
}

export interface BitcoinAddressResponse {
  success: boolean;
  data: BitcoinAddress;
  message?: string;
}

export interface BitcoinTransactionsResponse {
  success: boolean;
  data: BitcoinTransaction[];
  message?: string;
}

export interface BitcoinBalanceResponse {
  success: boolean;
  data: BitcoinBalance;
  message?: string;
}

export interface WebhookTransactionData {
  address: string;
  txHash: string;
  amount: number;
  confirmations: number;
  blockHeight?: number;
  timestamp: string;
}
