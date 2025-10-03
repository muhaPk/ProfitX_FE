import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BitcoinAddress, BitcoinBalance, BitcoinTransaction, TransactionConfirmation } from '@/shared/types/bitcoin'

interface AuthState {
  token: string | null
  user: any | null
  depositAddress: BitcoinAddress | null
  balance: BitcoinBalance | null
  transactions: BitcoinTransaction[]
  transactionConfirmations: Record<string, TransactionConfirmation>
  setAuth: (token: string, user: any) => void
  setDepositAddress: (address: BitcoinAddress | null) => void
  setBalance: (balance: BitcoinBalance | null) => void
  setTransactions: (transactions: BitcoinTransaction[]) => void
  setTransactionConfirmations: (confirmations: Record<string, TransactionConfirmation>) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      depositAddress: null,
      balance: null,
      transactions: [],
      transactionConfirmations: {},
      setAuth: (token, user) => set({ token, user }),
      setDepositAddress: (depositAddress) => set({ depositAddress }),
      setBalance: (balance) => set({ balance }),
      setTransactions: (transactions) => set({ transactions }),
      setTransactionConfirmations: (transactionConfirmations) => set({ transactionConfirmations }),
      clearAuth: () => set({ 
        token: null, 
        user: null, 
        depositAddress: null, 
        balance: null, 
        transactions: [], 
        transactionConfirmations: {} 
      }),
    }),
    {
      name: 'auth-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
