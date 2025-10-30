/**
 * @file app/analytics/page.tsx
 * @description Clean, focused analytics dashboard for universities
 * @dependencies react, next, @/components/analytics
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Users,
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import type { AnalyticsData } from '@/lib/analytics-utils';
import type { EnhancedAnalyticsData } from '@/lib/analytics-utils-enhanced';
import { account } from '@/lib/appwrite';
import { PriorityInsights } from '@/components/analytics/PriorityInsights';
import { SkillsGapChart } from '@/components/analytics/SkillsGapChart';
import { CourseEngagementChart } from '@/components/analytics/CourseEngagementChart';
import { ProfileFunnelChart } from '@/components/analytics/ProfileFunnelChart';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  enhanced?: Partial<EnhancedAnalyticsData>;
  industryBenchmarks?: {
    topSkills: Array<{ skill: string; demand: number; growth: number }>;
    avgSalaryGrowth: string;
    jobMarketTrend: string;
  };
  generatedAt: string;
  universityUser: {
    name: string;
    email: string;
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUniversityAccess, setHasUniversityAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkUniversityAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const checkUniversityAccess = async () => {
    try {
      const currentUser = await account.get();
      const hasAccess = currentUser.labels?.includes('university');
      setHasUniversityAccess(hasAccess || false);

      if (hasAccess) {
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Error checking university access:', err);
      setHasUniversityAccess(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const jwt = await account.createJWT();
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${jwt.jwt}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const result: AnalyticsResponse = await response.json();
      setAnalytics(result);
    } catch (err) {
      console.error('Fetch analytics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Checking access - show loading
  if (hasUniversityAccess === null) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
              <p className="text-text-muted">Verifying access...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Access denied
  if (!hasUniversityAccess) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
            <Card className="max-w-md w-full border-red-500/30 bg-red-500/5">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-text mb-2">Access Denied</h1>
                <p className="text-text-muted mb-6">
                  This page is only accessible to university accounts. Contact admin to request access.
                </p>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Loading state
  if (loading && !analytics) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Loader2 className="w-20 h-20 text-primary-500 animate-spin" />
                <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">Generating Analytics</h3>
              <p className="text-text-muted">Aggregating student data...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
            <Card className="max-w-md w-full border-red-500/30 bg-red-500/5">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text mb-2">Error Loading Analytics</h3>
                <p className="text-sm text-text-muted mb-6">{error}</p>
                <Button onClick={fetchAnalytics} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!analytics) return null;

  // Calculate gap data for priority insights
  const gapData = analytics.industryBenchmarks && analytics.enhanced?.skillsDetailed
    ? analytics.industryBenchmarks.topSkills.map(industry => {
        const studentSkill = analytics.enhanced!.skillsDetailed!.find(s => 
          s?.name && industry?.skill && s.name.toLowerCase() === industry.skill.toLowerCase()
        );
        const studentCoverage = studentSkill ? studentSkill.percentageOfTotal : 0;
        return {
          skill: industry.skill,
          gap: Math.max(0, industry.demand - studentCoverage),
          studentCoverage,
          industryDemand: industry.demand,
        };
      }).sort((a, b) => b.gap - a.gap)
    : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 pb-8">
            
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 p-8 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                      <h1 className="text-3xl font-bold">Institutional Analytics</h1>
                    </div>
                    <p className="text-white/90">Data-driven curriculum insights</p>
                  </div>
                </div>
                <Button
                  onClick={fetchAnalytics}
                  disabled={loading}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Refresh
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-bold text-text">{analytics.data.overview.totalStudents}</p>
                  <p className="text-sm text-text-muted mt-1">Total Students</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">{analytics.data.overview.avgProfileCompletion}%</span>
                  </div>
                  <p className="text-3xl font-bold text-text">{analytics.data.overview.avgProfileCompletion}%</p>
                  <p className="text-sm text-text-muted mt-1">Profile Completion</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="text-xs font-semibold text-purple-600">{analytics.data.overview.totalCourses}</span>
                  </div>
                  <p className="text-3xl font-bold text-text">{analytics.data.overview.courseCompletionRate}%</p>
                  <p className="text-sm text-text-muted mt-1">Course Completion</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary-500" />
                    </div>
                    <span className="text-xs font-semibold text-primary-600">{analytics.data.overview.totalPathways}</span>
                  </div>
                  <p className="text-3xl font-bold text-text">{analytics.data.overview.pathwayCompletionRate}%</p>
                  <p className="text-sm text-text-muted mt-1">Pathway Completion</p>
                </CardContent>
              </Card>
            </div>

            {/* Priority Insights */}
            <PriorityInsights
              skillsGap={gapData}
              totalStudents={analytics.data.overview.totalStudents}
              profileCompletionRate={analytics.data.overview.avgProfileCompletion}
              courseCompletionRate={analytics.data.overview.courseCompletionRate}
            />

            {/* Skills Gap */}
            {analytics.enhanced?.skillsDetailed && analytics.industryBenchmarks && (
              <SkillsGapChart
                studentSkills={analytics.enhanced.skillsDetailed}
                industryBenchmarks={analytics.industryBenchmarks.topSkills}
                totalStudents={analytics.data.overview.totalStudents}
              />
            )}

            {/* Course Engagement */}
            {analytics.enhanced?.courseEngagement && (
              <CourseEngagementChart
                platformStats={analytics.enhanced.courseEngagement.platformStats}
                difficultyStats={analytics.enhanced.courseEngagement.difficultyStats}
              />
            )}

            {/* Profile Funnel */}
            {analytics.enhanced?.profileFunnel && (
              <ProfileFunnelChart data={analytics.enhanced.profileFunnel} />
            )}

            {/* Footer */}
            <div className="text-center py-4">
              <p className="text-xs text-text-muted">
                Data updated {new Date(analytics.generatedAt).toLocaleString()} • All data anonymized
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
