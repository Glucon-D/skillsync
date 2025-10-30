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
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-surface border border-border hover:bg-background transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-primary-500" />
      ) : (
        <Moon className="w-5 h-5 text-primary-500" />
      )}
    </button>
  );
}
