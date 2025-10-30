/**
 * @file (dashboard)/layout.tsx
 * @description Dashboard layout with sidebar and navbar
 * @dependencies react, @/components/auth/ProtectedRoute, @/components/layout, @/components/data/DataLoader
 */

'use client';

import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DataLoader } from '@/components/data/DataLoader';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DataLoader />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
