/**
 * @file ProtectedRoute.tsx
 * @description Protected route wrapper component
 * @dependencies react, next/navigation, @/hooks/useAuth, @/lib/constants
 */

'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return <>{children}</>;
}
