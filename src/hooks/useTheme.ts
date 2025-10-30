/**
 * @file useTheme.ts
 * @description Custom hook for theme management
 * @dependencies react, @/lib/constants, @/lib/localStorage
 */

'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/localStorage';

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const savedTheme = storage.get<'light' | 'dark'>(STORAGE_KEYS.THEME);
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return { theme, setTheme, toggleTheme, mounted };
}
