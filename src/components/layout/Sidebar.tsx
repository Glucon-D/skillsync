/**
 * @file Sidebar.tsx
 * @description Dashboard sidebar navigation component
 * @dependencies react, next/link, next/navigation, lucide-react, framer-motion, @/lib/constants, @/lib/utils
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
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';

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
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);

  const getUserInitial = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getUsername = () => {
    return profile?.username || user?.email?.split('@')[0] || 'user';
  };

  return (
    <aside className="hidden md:flex w-64 flex-col bg-surface/50 backdrop-blur-sm border-r border-border h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 flex flex-col py-6 overflow-y-auto">
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'text-text-muted hover:bg-background hover:text-text hover:shadow-md'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-all duration-300',
                  isActive
                    ? 'bg-white/20'
                    : 'bg-transparent group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20'
                )}>
                  <Icon
                    className={cn(
                      'flex-shrink-0 h-5 w-5',
                      isActive ? 'text-white' : 'text-text-muted group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    )}
                  />
                </div>
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-4 w-2 h-2 rounded-full bg-white"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Portfolio Link */}
        {user && (
          <div className="px-3 mt-auto">
            <div className="mb-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <Link
              href={`/${getUsername()}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary-400 bg-background/50 hover:bg-background hover:shadow-lg transition-all duration-300 group"
            >
              {profile?.userImage ? (
                <img
                  src={profile.userImage}
                  alt={profile.username || user.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-primary-500 shadow-md"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                  {getUserInitial()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text truncate">
                  {profile?.username || user.name}
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1 font-medium group-hover:gap-2 transition-all">
                  View Portfolio
                  <ExternalLink className="w-3 h-3" />
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

export function MobileSidebar({ isOpen, closeAction }: { isOpen: boolean; closeAction: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);

  const getUserInitial = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getUsername = () => {
    return profile?.username || user?.email?.split('@')[0] || 'user';
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={closeAction}
      />
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-surface/95 backdrop-blur-xl border-r border-border md:hidden flex flex-col">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-3 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeAction}
                  className={cn(
                    'group relative flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'text-text-muted hover:bg-background hover:text-text hover:shadow-md'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-all duration-300',
                    isActive
                      ? 'bg-white/20'
                      : 'bg-transparent group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20'
                  )}>
                    <Icon
                      className={cn(
                        'flex-shrink-0 h-5 w-5',
                        isActive ? 'text-white' : 'text-text-muted group-hover:text-primary-600 dark:group-hover:text-primary-400'
                      )}
                    />
                  </div>
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute right-4 w-2 h-2 rounded-full bg-white"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Portfolio Link */}
          {user && (
            <div className="px-3 mt-auto pb-4">
              <div className="mb-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <Link
                href={`/${getUsername()}`}
                onClick={closeAction}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary-400 bg-background/50 hover:bg-background hover:shadow-lg transition-all duration-300 group"
              >
                {profile?.userImage ? (
                  <img
                    src={profile.userImage}
                    alt={profile.username || user.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-primary-500 shadow-md"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    {getUserInitial()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text truncate">
                    {profile?.username || user.name}
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1 font-medium group-hover:gap-2 transition-all">
                    View Portfolio
                    <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
