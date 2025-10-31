/**
 * @file auth/callback/page.tsx
 * @description OAuth callback handler for Google authentication
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { profileService } from '@/lib/db';
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
        
        // Get user from store after getCurrentUser completes
        const user = useAuthStore.getState().user;
        if (!user) {
          throw new Error('User not found after authentication');
        }

        // Check if profile exists directly from database
        const profile = await profileService.getByUserId(user.id);
        
        // If profile exists and has completed onboarding, go to dashboard
        // Otherwise go to onboarding
        if (profile && (profile.bio || profile.completionPercentage > 0)) {
          router.push(ROUTES.DASHBOARD);
        } else {
          router.push(ROUTES.ONBOARDING);
        }
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

