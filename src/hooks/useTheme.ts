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
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = storage.get<'light' | 'dark'>(STORAGE_KEYS.THEME);
  if (savedTheme) {
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return savedTheme;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return prefersDark ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

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
