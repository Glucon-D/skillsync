/**
 * @file Navbar.tsx
 * @description Main navigation bar component
 * @dependencies react, next/link, lucide-react, @/hooks/useAuth, @/lib/constants, @/components/layout/ThemeToggle
 */

'use client';

import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 border-b border-border backdrop-blur-md supports-[backdrop-filter]:bg-surface/60">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-text">SkillSync</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user && (
              <>
                <span className="text-sm text-text-muted">Welcome, <span className="text-text font-medium">{user.name}</span></span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text bg-transparent hover:bg-background rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text hover:bg-background transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated && user && (
              <>
                <p className="text-sm text-text-muted">Welcome, <span className="text-text font-medium">{user.name}</span></p>
                <button
                  onClick={handleLogout}
                  className="w-full inline-flex items-center justify-start px-3 py-2 text-sm font-medium text-text-muted hover:text-text bg-transparent hover:bg-background rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
