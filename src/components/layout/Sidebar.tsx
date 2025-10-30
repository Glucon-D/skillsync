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
  ExternalLink,
} from 'lucide-react';
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
    <aside className="hidden md:flex w-64 flex-col bg-surface border-r border-border h-[calc(100vh-4rem)] sticky top-16">
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

        {/* Portfolio Link */}
        {user && (
          <div className="px-4 mt-auto">
            <Link
              href={`/${getUsername()}`}
              className="flex items-center gap-3 px-3 py-3 rounded-lg border border-border hover:bg-background transition-colors group"
            >
              {profile?.userImage ? (
                <img
                  src={profile.userImage}
                  alt={profile.username || user.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-primary-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shrink-0">
                  {getUserInitial()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {profile?.username || user.name}
                </p>
                <p className="text-xs text-text-muted flex items-center gap-1">
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
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border md:hidden flex flex-col">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
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

          {/* Portfolio Link */}
          {user && (
            <div className="px-3 mt-auto pb-4">
              <Link
                href={`/${getUsername()}`}
                onClick={closeAction}
                className="flex items-center gap-3 px-3 py-3 rounded-lg border border-border hover:bg-background transition-colors"
              >
                {profile?.userImage ? (
                  <img
                    src={profile.userImage}
                    alt={profile.username || user.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-primary-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shrink-0">
                    {getUserInitial()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">
                    {profile?.username || user.name}
                  </p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
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
