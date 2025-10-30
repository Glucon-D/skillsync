/**
 * @file useAuth.ts
 * @description Custom hook for authentication
 * @dependencies @/store/authStore
 */

'use client';

import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, isAuthenticated, login, signup, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };
}
