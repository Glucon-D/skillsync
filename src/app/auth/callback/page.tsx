/**
 * @file auth/callback/page.tsx
 * @description OAuth callback handler for Google authentication
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';

export default function AuthCallbackPage() {
  const router = useRouter();
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait a bit for Appwrite to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch the current user session
        await getCurrentUser();
        
        // Always redirect to dashboard (no onboarding)
        router.push(ROUTES.DASHBOARD);
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.push(`${ROUTES.LOGIN}?error=oauth_failed`);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [getCurrentUser, router]);

  if (!isProcessing) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-text-muted">Completing authentication...</p>
      </div>
    </div>
  );
}

