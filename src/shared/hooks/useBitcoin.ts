import { useState, useEffect } from 'react';
import { useGenericGet } from './useGenericGet';
import { 
  BitcoinAddress, 
  BitcoinTransaction, 
  BitcoinBalance,
  BitcoinAddressResponse,
  BitcoinTransactionsResponse,
  BitcoinBalanceResponse 
} from '@/shared/types/bitcoin';
import { API_BITCOIN_ADDRESS, API_BITCOIN_TRANSACTIONS, API_BITCOIN_BALANCE } from '@/shared/config/endpoints';

export const useBitcoin = () => {
  const [address, setAddress] = useState<BitcoinAddress | null>(null);
  const [transactions, setTransactions] = useState<BitcoinTransaction[]>([]);
  const [balance, setBalance] = useState<BitcoinBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loadData } = useGenericGet();

  // Get user's Bitcoin deposit address
  const getDepositAddress = async () => {
    await loadData({
      api: API_BITCOIN_ADDRESS,
      method: 'GET',
      loader: setIsLoading,
      dataCallback: (response: BitcoinAddressResponse) => {
        
        if (response.success) {
          setAddress(response.data);
        } else {
          setError(response.message || 'Failed to get deposit address');
        }
      },
    });
  };

  // Get transaction history
  const getTransactions = async () => {
    if (!address) return;
    
    await loadData({
      api: `${API_BITCOIN_TRANSACTIONS}?address=${address.address}`,
      method: 'GET',
      loader: setIsLoading,
      dataCallback: (response: BitcoinTransactionsResponse) => {
        if (response.success) {
          setTransactions(response.data);
        } else {
          setError(response.message || 'Failed to get transactions');
        }
      },
    });
  };

  // Get current balance
  const getBalance = async () => {
    if (!address) return;
    
    await loadData({
      api: `${API_BITCOIN_BALANCE}?address=${address.address}`,
      method: 'GET',
      loader: setIsLoading,
      dataCallback: (response: BitcoinBalanceResponse) => {
        if (response.success) {
          setBalance(response.data);
        } else {
          setError(response.message || 'Failed to get balance');
        }
      },
    });
  };

  // Refresh all data
  const refreshData = async () => {
    if (address) {
      await Promise.all([getBalance(), getTransactions()]);
    }
  };

  // Auto-refresh balance every 30 seconds when address is available
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(() => {
      getBalance();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [address]);

  return {
    address,
    transactions,
    balance,
    isLoading,
    error,
    getDepositAddress,
    getTransactions,
    getBalance,
    refreshData,
    setError
  };
};
