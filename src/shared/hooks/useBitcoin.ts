import { useState, useEffect } from 'react';
import { useGenericGet } from './useGenericGet';
import { useGenericSet } from './useGenericSet';
import { 
  BitcoinAddressResponse,
  BitcoinTransactionsResponse,
  BitcoinBalanceResponse,
  TransactionConfirmationResponse
} from '@/shared/types/bitcoin';
import { API_BITCOIN_ADDRESS, API_BITCOIN_TRANSACTIONS, API_BITCOIN_BALANCE, API_BITCOIN_ADDRESS_ACTIVATE, API_BITCOIN_TRANSACTION_CONFIRMATIONS } from '@/shared/config/endpoints';
import { useAuthStore } from '@/shared/store/auth.store';

export const useBitcoin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loadData } = useGenericGet();
  const { uploadData } = useGenericSet();
  const { 
    depositAddress, 
    balance, 
    transactions, 
    transactionConfirmations,
    setDepositAddress, 
    setBalance, 
    setTransactions, 
    setTransactionConfirmations 
  } = useAuthStore();

  // Auto-fetch balance and transactions when address is available
  useEffect(() => {
    if (depositAddress) {
      getBalance();
      getTransactions();
    }
  }, [depositAddress]);

  useEffect(() => {
    if (!depositAddress) {
      getDepositAddress();
    }
  }, [depositAddress]);



  const getDepositAddress = async () => {
    await loadData({
      api: API_BITCOIN_ADDRESS,
      method: 'GET',
      loader: setIsLoading,
      dataCallback: (response: BitcoinAddressResponse) => {
        
        if (response.success) {
          console.log('✅ Address found:', response.data);
          setDepositAddress(response.data);
        } else {
          console.log('ℹ️ No address found, user needs to activate');
          setDepositAddress(null);
        }
      },
    });
  };


  const activateDepositAddress = async () => {
    
    await uploadData({
      api: API_BITCOIN_ADDRESS_ACTIVATE,
      method: 'post',
      data: {}, // Empty data for POST request
      loader: setIsLoading,
      dataCallback: (response: BitcoinAddressResponse) => {
        if (response.success) {
          setDepositAddress(response.data);
        } else {
          setError(response.message || 'Failed to activate deposit address');
        }
      },
    });
  };

  // Get transaction history
  const getTransactions = async () => {
    if (!depositAddress) return;
    
    await loadData({
      api: `${API_BITCOIN_TRANSACTIONS}?address=${depositAddress.address}`,
      method: 'GET',
      loader: setIsLoading,
      dataCallback: (response: BitcoinTransactionsResponse) => {
        if (response.success) {
          setTransactions(response.data); // Store in Zustand
        } else {
          setError(response.message || 'Failed to get transactions');
        }
      },
    });
  };

  // Get current balance
  const getBalance = async (forceUpdate: boolean = false) => {
    if (!depositAddress) return;
    
    const updateParam = forceUpdate ? '?update=true' : '';
    
    await loadData({
      api: `${API_BITCOIN_BALANCE}${updateParam}`,
      method: 'GET',
      loader: setIsLoading,
      dataCallback: (response: BitcoinBalanceResponse) => {
        if (response.success) {
          console.log('getBalance response:', response.data);
          setBalance(response.data); // Store in Zustand
        } else {
          setError(response.message || 'Failed to get balance');
        }
      },
    });
  };


  // Get transaction confirmations
  const getTransactionConfirmations = async (txHash: string) => {
    await loadData({
      api: `${API_BITCOIN_TRANSACTION_CONFIRMATIONS}/${txHash}/confirmations`,
      method: 'GET',
      loader: setIsLoading,
      dataCallback: (response: TransactionConfirmationResponse) => {
        if (response.success) {
          setTransactionConfirmations({
            ...transactionConfirmations,
            [txHash]: response.data
          }); // Store in Zustand
        } else {
          setError(response.message || 'Failed to get transaction confirmations');
        }
      },
    });
  };

  // Check confirmations for all pending transactions
  const checkAllTransactionConfirmations = async () => {
    const pendingTransactions = transactions.filter(tx => 
      tx.status === 'pending' || tx.confirmations < 6
    );
    
    for (const tx of pendingTransactions) {
      await getTransactionConfirmations(tx.tx_hash);
    }
  };


  // Combined refresh interval - runs every 30 seconds
  useEffect(() => {
    if (!depositAddress) return;

    const interval = setInterval(async () => {
      // Always get new transactions
      await getTransactions();
      
      // Check confirmations for pending transactions
      if (transactions.length > 0) {
        await checkAllTransactionConfirmations();
      }
      
      // Update balance if there are pending transactions
      const hasPendingTransactions = transactions.some(tx => 
        tx.status === 'pending' || tx.confirmations < 6
      );
      
      if (hasPendingTransactions) {
        await getBalance(true); // Force update when pending transactions
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [depositAddress, transactions]);
  

  return {
    depositAddress,
    transactions,
    balance,
    isLoading,
    error,
    transactionConfirmations,
    getDepositAddress,
    activateDepositAddress,
    getTransactions,
    getBalance,
    getTransactionConfirmations,
    checkAllTransactionConfirmations,
    setError
  };
};
