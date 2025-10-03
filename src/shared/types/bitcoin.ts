export interface BitcoinAddress {
  id: string;
  user_id: string;
  address: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BitcoinTransaction {
  id: string;
  address_id: string;
  tx_hash: string;
  amount: number; // in satoshis (converted from BigInt)
  confirmations: number;
  block_height?: number;
  timestamp: string;
  type: string; // 'received' or 'sent'
  status: string; // 'pending', 'confirmed', or 'failed'
  created_at: string;
  updated_at: string;
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

export interface TransactionConfirmation {
  confirmations: number;
  status: 'pending' | 'confirmed';
  block_height?: number;
  confirmed: boolean;
  received?: number;
  confirmed_time?: string;
  error?: string;
}

export interface TransactionConfirmationResponse {
  success: boolean;
  data: TransactionConfirmation;
  message?: string;
}
