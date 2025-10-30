/**
 * @file Navbar.tsx
 * @description Main navigation bar component
 * @dependencies react, next/link, lucide-react, @/hooks/useAuth, @/lib/constants, @/components/layout/ThemeToggle
 */

'use client';

import Link from 'next/link';
import { LogOut, Menu, X, User, ChevronDown, MessageSquare, Briefcase, TrendingUp, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    window.location.href = ROUTES.LOGIN;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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
            {isAuthenticated && user ? (
              <>
                <ThemeToggle />
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-text">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href={ROUTES.CAREERS}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text hover:bg-background transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 bg-primary-500/10 rounded-lg flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                            <Briefcase className="w-4.5 h-4.5 text-primary-600 dark:text-primary-500" />
                          </div>
                          <span className="font-medium text-sm">Career Paths</span>
                        </Link>

                        <Link
                          href={ROUTES.COURSES}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text hover:bg-background transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 bg-primary-500/10 rounded-lg flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                            <TrendingUp className="w-4.5 h-4.5 text-primary-600 dark:text-primary-500" />
                          </div>
                          <span className="font-medium text-sm">Courses</span>
                        </Link>

                        <Link
                          href={ROUTES.PROFILE}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text hover:bg-background transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 bg-primary-500/10 rounded-lg flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                            <Settings className="w-4.5 h-4.5 text-primary-600 dark:text-primary-500" />
                          </div>
                          <span className="font-medium text-sm">Settings</span>
                        </Link>

                        <div className="h-px bg-border my-1.5" />

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                            <LogOut className="w-4.5 h-4.5 text-red-500" />
                          </div>
                          <span className="font-medium text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <ThemeToggle />
            )}
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
