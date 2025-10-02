import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BitcoinAddress } from '@/shared/types/bitcoin'

interface AuthState {
  token: string | null
  user: any | null
  depositAddress: BitcoinAddress | null
  setAuth: (token: string, user: any) => void
  setDepositAddress: (address: BitcoinAddress | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      depositAddress: null,
      setAuth: (token, user) => set({ token, user }),
      setDepositAddress: (depositAddress) => set({ depositAddress }),
      clearAuth: () => set({ token: null, user: null, depositAddress: null }),
    }),
    {
      name: 'auth-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
