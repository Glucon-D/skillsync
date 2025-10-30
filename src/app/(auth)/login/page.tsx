/**
 * @file (auth)/login/page.tsx
 * @description Enhanced login page with improved styling
 * @dependencies next/link, @/components/auth/LoginForm, @/lib/constants
 */

import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-surface/95 dark:bg-surface/90">
      <CardHeader className="text-center space-y-2 pb-6">
        <div className="mx-auto w-14 h-14 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-2 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-shadow duration-300">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <CardTitle className="text-3xl font-bold text-text">Welcome Back</CardTitle>
        <p className="text-text-muted text-base">Sign in to continue your journey</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-2 text-text-muted">or</span>
          </div>
        </div>
        <p className="text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.SIGNUP} className="text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200 hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
