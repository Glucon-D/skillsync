/**
 * @file (dashboard)/dashboard/page.tsx
 * @description Main dashboard page
 * @dependencies next/link, lucide-react, @/hooks/useAuth, @/useProfileStore, @/useCoursesStore, @/lib/constants
 */

'use client';

import Link from 'next/link';
import { BookOpen, Map, Briefcase, ClipboardList, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfileStore } from '@/store/profileStore';
import { useCoursesStore } from '@/store/coursesStore';
import { ROUTES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();
  const profile = useProfileStore((state) => state.profile);
  const bookmarkedCourses = useCoursesStore((state) => state.bookmarkedCourses);
  const completionPercentage = profile?.completionPercentage || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Welcome back, {user?.name}!</h1>
        <p className="text-text-muted">Here&apos;s your progress overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-muted">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text">{completionPercentage}%</div>
            <div className="mt-2 w-full bg-background rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-muted">Bookmarked Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text">{bookmarkedCourses.length}</div>
            <p className="text-sm text-text-muted mt-1">Courses saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-muted">Skills Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text">{profile?.skills.length || 0}</div>
            <p className="text-sm text-text-muted mt-1">Skills added</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={ROUTES.ASSESSMENT}
              className="inline-flex w-full items-center justify-start px-4 py-2 rounded-lg border-2 border-border text-text bg-surface hover:bg-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <ClipboardList className="w-5 h-5 mr-2" />
              Take Assessment
            </Link>
            <Link
              href={ROUTES.PATHWAYS}
              className="inline-flex w-full items-center justify-start px-4 py-2 rounded-lg border-2 border-border text-text bg-surface hover:bg-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Map className="w-5 h-5 mr-2" />
              View Pathways
            </Link>
            <Link
              href={ROUTES.COURSES}
              className="inline-flex w-full items-center justify-start px-4 py-2 rounded-lg border-2 border-border text-text bg-surface hover:bg-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Courses
            </Link>
            <Link
              href={ROUTES.CAREERS}
              className="inline-flex w-full items-center justify-start px-4 py-2 rounded-lg border-2 border-border text-text bg-surface hover:bg-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Explore Careers
            </Link>
          </div>
        </CardContent>
      </Card>

      {completionPercentage < 100 && (
        <Card className="border-primary-500">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-text flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
                  Complete Your Profile
                </h3>
                <p className="text-sm text-text-muted mt-1">
                  Add more information to get better career recommendations
                </p>
              </div>
              <Link
                href={ROUTES.PROFILE}
                className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-base bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
              >
                Complete Profile
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
