/**
 * @file Sidebar.tsx
 * @description Dashboard sidebar navigation component
 * @dependencies react, next/link, next/navigation, lucide-react, @/lib/constants, @/lib/utils
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  ClipboardList,
  Map,
  BookOpen,
  Briefcase,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'Profile', href: ROUTES.PROFILE, icon: User },
  { name: 'Assessment', href: ROUTES.ASSESSMENT, icon: ClipboardList },
  { name: 'Pathways', href: ROUTES.PATHWAYS, icon: Map },
  { name: 'Courses', href: ROUTES.COURSES, icon: BookOpen },
  { name: 'Careers', href: ROUTES.CAREERS, icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-surface border-r border-border min-h-screen">
      <div className="flex-1 flex flex-col py-6 overflow-y-auto">
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-text-muted hover:bg-background hover:text-text'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive ? 'text-white' : 'text-text-muted group-hover:text-text'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function MobileSidebar({ isOpen, closeAction }: { isOpen: boolean; closeAction: () => void }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={closeAction}
      />
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border md:hidden">
        <div className="flex flex-col h-full pt-5 pb-4">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeAction}
                  className={cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-text-muted hover:bg-background hover:text-text'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-white' : 'text-text-muted group-hover:text-text'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
