/**
 * @file (auth)/layout.tsx
 * @description Auth layout for login and signup pages
 * @dependencies react
 */

import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
