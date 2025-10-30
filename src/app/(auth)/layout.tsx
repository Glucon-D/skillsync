/**
 * @file (auth)/layout.tsx
 * @description Auth layout for login and signup pages with gradient background and navbar
 * @dependencies react, next/link, @/lib/constants, @/components/layout/ThemeToggle
 */

'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient - matching landing page */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 dark:from-primary-500/10 dark:to-primary-600/10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/20 dark:bg-primary-600/10 rounded-full blur-3xl opacity-20 animate-pulse" />

      <div className="relative z-10">
        {/* Navigation - matching landing page */}
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href={ROUTES.HOME} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-text">SkillSync</span>
              </Link>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="flex items-center justify-center px-4 py-12 sm:py-16">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
