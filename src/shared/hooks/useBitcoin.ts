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
import { API_BITCOIN_ADDRESS, API_BITCOIN_TRANSACTIONS, API_BITCOIN_BALANCE, API_BITCOIN_ADDRESS_ACTIVATE } from '@/shared/config/endpoints';
import { useAuthStore } from '@/shared/store/auth.store';

export const useBitcoin = () => {
  const [transactions, setTransactions] = useState<BitcoinTransaction[]>([]);
  const [balance, setBalance] = useState<BitcoinBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loadData } = useGenericGet();
  const { bitcoinAddress, setBitcoinAddress } = useAuthStore();

  // Auto-fetch balance and transactions when address is available
  useEffect(() => {
    if (bitcoinAddress) {
      refreshData();
    }
  }, [bitcoinAddress]);

  // Get user's Bitcoin deposit address (if exists)
  const getDepositAddress = async () => {
    await loadData({
      api: API_BITCOIN_ADDRESS,
      method: 'GET',
      loader: setIsLoading,
      dataCallback: (response: BitcoinAddressResponse) => {
        
        if (response.success) {
          console.log('✅ Address found:', response.data);
          setBitcoinAddress(response.data);
        } else {
          console.log('ℹ️ No address found, user needs to activate');
          setBitcoinAddress(null);
        }
      },
    });
  };

  // Activate/create new Bitcoin deposit address
  const activateDepositAddress = async () => {
    await loadData({
      api: API_BITCOIN_ADDRESS_ACTIVATE,
      method: 'POST',
      loader: setIsLoading,
      dataCallback: (response: BitcoinAddressResponse) => {
        console.log('✅ Activate address response:', response);
        
        if (response.success) {
          console.log('✅ Address activated:', response.data);
          setBitcoinAddress(response.data);
        } else {
          console.log('❌ Failed to activate address:', response.message);
          setError(response.message || 'Failed to activate deposit address');
        }
      },
    });
  };

  // Get transaction history
  const getTransactions = async () => {
    if (!bitcoinAddress) return;
    
    await loadData({
      api: `${API_BITCOIN_TRANSACTIONS}?address=${bitcoinAddress.address}`,
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
    if (!bitcoinAddress) return;
    
    await loadData({
      api: `${API_BITCOIN_BALANCE}?address=${bitcoinAddress.address}`,
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
    if (bitcoinAddress) {
      await Promise.all([getBalance(), getTransactions()]);
    }
  };

  // Auto-refresh balance every 30 seconds when address is available
  // useEffect(() => {
  //   if (!bitcoinAddress) return;

  //   const interval = setInterval(() => {
  //     getBalance();
  //   }, 30000); // 30 seconds

  //   return () => clearInterval(interval);
  // }, [bitcoinAddress]);

  return {
    address: bitcoinAddress,
    transactions,
    balance,
    isLoading,
    error,
    getDepositAddress,
    activateDepositAddress,
    getTransactions,
    getBalance,
    refreshData,
    setError
  };
};
