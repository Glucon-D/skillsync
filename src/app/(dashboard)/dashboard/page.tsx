/**
 * @file (dashboard)/dashboard/page.tsx
 * @description Main dashboard page with modern UI and industry trends
 * @dependencies next/link, lucide-react, @/hooks/useAuth, @/useProfileStore, @/useCoursesStore, @/lib/constants
 */

"use client";

import Link from "next/link";
import {
  BookOpen,
  Map,
  Briefcase,
  ClipboardList,
  TrendingUp,
  Sparkles,
  Award,
  Target,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/profileStore";
import { useCoursesStore } from "@/store/coursesStore";
import { ROUTES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndustryTrends from "@/components/dashboard/IndustryTrends";

export default function DashboardPage() {
  const { user } = useAuth();
  const profile = useProfileStore((state) => state.profile);
  const bookmarkedCourses = useCoursesStore((state) => state.bookmarkedCourses);
  const completionPercentage = profile?.completionPercentage || 0;

  return (
    <div className="space-y-8 pb-8 p-6 md:p-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            {/* <Sparkles className="w-8 h-8 animate-pulse" /> */}
            <h1 className="text-4xl font-bold">Welcome back, {user?.name}!</h1>
          </div>
          <p className="text-white/90 text-lg">
            Track your progress and explore new opportunities
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-500" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-text mb-1">
                  {completionPercentage}%
                </div>
                <p className="text-sm text-text-muted">Profile Completion</p>
              </div>
            </div>
            <div className="w-full bg-background rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-500" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-text mb-1">
                  {bookmarkedCourses.length}
                </div>
                <p className="text-sm text-text-muted">Bookmarked Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-primary-500" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-text mb-1">
                  {profile?.skills.length || 0}
                </div>
                <p className="text-sm text-text-muted">Skills Mastered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion Banner */}
      {completionPercentage < 100 && (
        <Card className="border-2 border-primary-500/30 bg-gradient-to-br from-primary-500/5 to-primary-600/10 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-text-muted">
                    Unlock personalized career recommendations and industry
                    insights tailored to you
                  </p>
                </div>
              </div>
              <Link
                href={ROUTES.PROFILE}
                className="inline-flex items-center justify-center font-medium rounded-xl px-6 py-3 bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 active:bg-primary-700 transition-all duration-200 whitespace-nowrap"
              >
                Complete Now
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industry Trends Section */}
      <IndustryTrends profile={profile} />
    </div>
  );
}
