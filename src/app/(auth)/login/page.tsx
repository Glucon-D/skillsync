/**
 * @file (auth)/login/page.tsx
 * @description Login page
 * @dependencies next/link, @/components/auth/LoginForm, @/lib/constants
 */

import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <p className="text-text-muted">Sign in to continue your journey</p>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.SIGNUP} className="text-primary-500 hover:text-primary-600 font-medium">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
