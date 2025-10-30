/**
 * @file useAuth.ts
 * @description Custom hook for authentication
 * @dependencies @/store/authStore
 */

"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    loginWithGoogle,
    getCurrentUser,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    loginWithGoogle,
    getCurrentUser,
  };
}
