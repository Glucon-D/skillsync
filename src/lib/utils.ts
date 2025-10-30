/**
 * @file utils.ts
 * @description Utility helper functions
 * @dependencies none
 */

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function calculateProfileCompletion(profile: {
  bio: string;
  education: unknown[];
  skills: unknown[];
  experience: unknown[];
}): number {
  let completion = 0;
  
  if (profile.bio) completion += 25;
  if (profile.education.length > 0) completion += 25;
  if (profile.skills.length > 0) completion += 25;
  if (profile.experience.length > 0) completion += 25;
  
  return completion;
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}
