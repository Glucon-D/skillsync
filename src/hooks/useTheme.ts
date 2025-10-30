/**
 * @file useTheme.ts
 * @description Custom hook for theme management
 * @dependencies react, @/lib/constants, @/lib/localStorage
 */

'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/localStorage';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = storage.get<'light' | 'dark'>(STORAGE_KEYS.THEME);
  if (savedTheme) return savedTheme;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme);
  const mounted = true;
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return { theme, setTheme, toggleTheme, mounted };
}
