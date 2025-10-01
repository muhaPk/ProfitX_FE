import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BitcoinAddress } from '@/shared/types/bitcoin'

interface AuthState {
  token: string | null
  user: any | null
  bitcoinAddress: BitcoinAddress | null
  setAuth: (token: string, user: any) => void
  setBitcoinAddress: (address: BitcoinAddress | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      bitcoinAddress: null,
      setAuth: (token, user) => set({ token, user }),
      setBitcoinAddress: (bitcoinAddress) => set({ bitcoinAddress }),
      clearAuth: () => set({ token: null, user: null, bitcoinAddress: null }),
    }),
    {
      name: 'auth-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
