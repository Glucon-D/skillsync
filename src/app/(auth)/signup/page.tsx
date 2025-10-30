/**
 * @file (auth)/signup/page.tsx
 * @description Signup page
 * @dependencies next/link, @/components/auth/SignupForm, @/lib/constants
 */

import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';
import { ROUTES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <p className="text-text-muted">Start your career journey today</p>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="text-primary-500 hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
