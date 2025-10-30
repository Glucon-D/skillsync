/**
 * @file authStore.ts
 * @description Authentication state management with Zustand
 * @dependencies zustand, @/lib/types, @/lib/localStorage, @/lib/constants
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';
import { storage } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId } from '@/lib/utils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const users = storage.get<Record<string, { name: string; email: string; password: string }>>(STORAGE_KEYS.AUTH_USER) || {};
        
        const userEntry = Object.entries(users).find(([, u]) => u.email === email);
        
        if (userEntry && userEntry[1].password === password) {
          const [id, userData] = userEntry;
          const user: User = {
            id,
            name: userData.name,
            email: userData.email,
            createdAt: new Date().toISOString(),
          };
          
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },

      signup: async (name: string, email: string, password: string) => {
        const users = storage.get<Record<string, { name: string; email: string; password: string }>>(STORAGE_KEYS.AUTH_USER) || {};
        
        const emailExists = Object.values(users).some(u => u.email === email);
        if (emailExists) return false;
        
        const id = generateId();
        users[id] = { name, email, password };
        storage.set(STORAGE_KEYS.AUTH_USER, users);
        
        const user: User = {
          id,
          name,
          email,
          createdAt: new Date().toISOString(),
        };
        
        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
    }
  )
);
