import { useState } from 'react';
import { useGenericGet } from '@/shared/hooks/useGenericGet';
import { useGenericSet } from '@/shared/hooks/useGenericSet';
import { useAuthStore } from '@/shared/store/auth.store';
import { 
  API_BITCOIN_ADDRESS, 
  API_BITCOIN_TRANSACTIONS, 
  API_BITCOIN_BALANCE, 
  API_BITCOIN_ADDRESS_ACTIVATE,
  API_BITCOIN_HANDLE_PENDING,
  API_BITCOIN_HANDLE_CONFIRMED
} from '@/shared/config/endpoints';
import { 
  BitcoinAddressResponse,
  BitcoinTransactionsResponse,
  BitcoinBalanceResponse
} from '@/shared/types/bitcoin';

export const useBitcoinService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { loadData } = useGenericGet();
  const { uploadData } = useGenericSet();
  const { 
    depositAddress, 
    transactions, 
    balance,
    transactionConfirmations,
    token,
    setDepositAddress, 
    setBalance, 
    setTransactions, 
    setTransactionConfirmations 
  } = useAuthStore();

  // Get deposit address
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

  // Activate deposit address
  const activateDepositAddress = async () => {
    await uploadData({
      api: API_BITCOIN_ADDRESS_ACTIVATE,
      method: 'post',
      data: {},
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
  const getTransactions = async (sync: boolean = false): Promise<any[]> => {
    if (!token) return []; // Only proceed if user is authenticated
    
    const syncParam = sync ? '?sync=true' : '';
    
    return new Promise((resolve, reject) => {
      loadData({
        api: `${API_BITCOIN_TRANSACTIONS}${syncParam}`, // Add sync parameter
        method: 'GET',
        loader: setIsLoading,
        dataCallback: (response: BitcoinTransactionsResponse) => {
          if (response.success) {
            setTransactions(response.data);
            resolve(response.data); // Return the transactions
          } else {
            setError(response.message || 'Failed to get transactions');
            reject(new Error(response.message || 'Failed to get transactions'));
          }
        },
      }).catch((error) => {
        reject(error);
      });
    });
  };

  // Handle pending transactions via backend
  const handlePendingTransactions = async () => {
    if (!token) return;
    
    try {
      await uploadData({
        api: API_BITCOIN_HANDLE_PENDING,
        method: 'POST',
        data: {},
        loader: setIsLoading,
        dataCallback: (response: any) => {
          if (response.success) {
            console.log('✅ Pending transactions handled successfully');
          } else {
            console.warn('⚠️ Failed to handle pending transactions:', response.message);
          }
        },
      });
    } catch (error) {
      console.warn('Error handling pending transactions:', error);
    }
  };

  // Handle confirmed transactions via backend
  const handleConfirmedTransactions = async () => {
    if (!token) return;
    
    try {
      await uploadData({
        api: API_BITCOIN_HANDLE_CONFIRMED,
        method: 'POST',
        data: {},
        loader: setIsLoading,
        dataCallback: (response: any) => {
          if (response.success) {
            console.log('✅ Confirmed transactions handled successfully');
          } else {
            console.warn('⚠️ Failed to handle confirmed transactions:', response.message);
          }
        },
      });
    } catch (error) {
      console.warn('Error handling confirmed transactions:', error);
    }
  };

  // Combined refresh function
  const performRefresh = async () => {
    if (!token) return;

    try {
      const freshTransactions = await getTransactions(true); // check new transactions
      
      // Check for pending transactions (1-5 confirmations)
      const hasPendingTransactions = freshTransactions.some(tx => 
        tx.status === 'pending' || (tx.confirmations >= 1 && tx.confirmations < 6)
      );
      
      // Check for confirmed transactions (6+ confirmations)
      const hasConfirmedTransactions = freshTransactions.some(tx => 
        tx.status === 'confirmed' || tx.confirmations >= 6
      );
      
      // Call backend handlers based on transaction states
      if (hasPendingTransactions) {
        console.log('📋 Found pending transactions, calling backend handler...');
        await handlePendingTransactions();
      }
      
      if (hasConfirmedTransactions) {
        console.log('✅ Found confirmed transactions, calling backend handler...');
        await handleConfirmedTransactions();
      }
      
    } catch (error) {
      console.warn('Bitcoin service refresh error:', error);
    }
  };

  return {
    // State
    depositAddress,
    transactions,
    balance,
    transactionConfirmations,
    isLoading,
    error,
    
    // Functions
    getDepositAddress,
    activateDepositAddress,
    getTransactions,
    performRefresh,
    handlePendingTransactions,
    handleConfirmedTransactions,
    setError
  };
};
