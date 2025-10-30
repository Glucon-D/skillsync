/**
 * @file (dashboard)/layout.tsx
 * @description Dashboard layout with sidebar and navbar
 * @dependencies react, @/components/auth/ProtectedRoute, @/components/layout
 */

'use client';

import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
