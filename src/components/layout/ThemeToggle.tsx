/**
 * @file ThemeToggle.tsx
 * @description Theme toggle button component
 * @dependencies react, lucide-react, @/hooks/useTheme
 */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-border animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg border border-border hover:border-primary-500 bg-surface hover:bg-background transition-all duration-200 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-primary-500 transition-transform group-hover:rotate-45 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-primary-500 transition-transform group-hover:-rotate-12 duration-300" />
      )}
    </button>
  );
}
