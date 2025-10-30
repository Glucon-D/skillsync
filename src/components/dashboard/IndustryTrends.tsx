/**
 * @file components/dashboard/IndustryTrends.tsx
 * @description Industry trends component showing real-time job market insights
 * @dependencies react, lucide-react, @/components/ui, @/lib/types
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Sparkles,
  AlertCircle,
  Loader2,
  RefreshCw,
  Briefcase,
  ArrowRight,
  LineChart,
  BarChart3,
  Zap,
  Award,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import type { Profile } from "@/lib/types";

interface IndustryInsight {
  trend: string;
  description: string;
  relevance: "high" | "medium" | "low";
  category: "job_demand" | "salary_growth" | "emerging_skill";
}

interface IndustryInsightsData {
  insights: IndustryInsight[];
  jobMarketTrend: string;
  topSkillsDemand: string[];
  avgSalaryGrowth: string;
  generatedAt: string;
  isProfileBased: boolean;
}

interface IndustryTrendsProps {
  profile?: Profile | null;
}

export default function IndustryTrends({ profile }: IndustryTrendsProps) {
  const [insights, setInsights] = useState<IndustryInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const jobDemandRef = useRef<HTMLDivElement>(null);
  const salaryGrowthRef = useRef<HTMLDivElement>(null);
  const emergingSkillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.userId]);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const fetchInsights = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/industry-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile || undefined,
          forceRefresh, // Tell API to bypass cache
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch industry insights");
      }

      const result = await response.json();
      setInsights(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "job_demand":
        return <Briefcase className="w-4 h-4" />;
      case "salary_growth":
        return <DollarSign className="w-4 h-4" />;
      case "emerging_skill":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getRelevanceBadgeColor = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "bg-green-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-primary-500 text-white";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "job_demand":
        return "Job Demand";
      case "salary_growth":
        return "Salary Growth";
      case "emerging_skill":
        return "Emerging Skill";
      default:
        return "Trend";
    }
  };

  if (isLoading && !insights) {
    return (
      <Card className="border-primary-500/20 shadow-lg">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <Loader2 className="w-20 h-20 text-primary-500 animate-spin" />
              <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">
              Analyzing Market Trends
            </h3>
            <p className="text-text-muted">
              Fetching latest industry insights from real-time data...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-primary-500/30 bg-primary-500/5 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 p-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-primary-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text mb-1">
                Unable to load insights
              </h3>
              <p className="text-sm text-text-muted mb-4">{error}</p>
              <Button
                onClick={() => fetchInsights(false)}
                size="sm"
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  // Group insights by category
  const jobDemandInsights = insights.insights.filter(
    (i) => i.category === "job_demand"
  );
  const salaryGrowthInsights = insights.insights.filter(
    (i) => i.category === "salary_growth"
  );
  const emergingSkillInsights = insights.insights.filter(
    (i) => i.category === "emerging_skill"
  );

  return (
    <div className="space-y-6">
      {/* Professional Header with Visual Indicator */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h2 className="text-2xl font-bold text-text tracking-tight">
                Industry Insights
              </h2>
              {insights.isProfileBased ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  <span className="text-xs font-medium text-primary-700">
                    Personalized
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border">
                  <Activity className="w-3 h-3 text-text-muted" />
                  <span className="text-xs font-medium text-text-muted">
                    General Market
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-text-muted max-w-2xl">
              {insights.isProfileBased
                ? "Real-time market intelligence tailored to your skills and career trajectory"
                : "Comprehensive overview of technology sector trends and opportunities"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => fetchInsights(true)}
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="gap-2 shrink-0"
          title="Force refresh - bypass cache and get latest data"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Updating</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </>
          )}
        </Button>
      </div>

      {/* Minimal CTA */}
      {!insights.isProfileBased && (
        <Card className="border-primary-500/30 bg-primary-500/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-text-muted">
                <Sparkles className="w-4 h-4 inline mr-2 text-primary-500" />
                Complete your profile for personalized insights tailored to your
                skills
              </p>
              <Link
                href={ROUTES.PROFILE}
                className="text-sm font-medium text-primary-500 hover:text-primary-600 whitespace-nowrap flex items-center gap-1"
              >
                Complete Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Overview Cards with Micro-Viz */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Market Outlook */}
        <Card className="relative overflow-hidden border-border hover:border-primary-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-16 translate-x-16"></div>
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <LineChart className="w-5 h-5 text-primary-500" />
              </div>
              <TrendingUp className="w-4 h-4 text-primary-500" />
            </div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              Market Outlook
            </p>
            <p className="text-sm text-text leading-relaxed font-medium">
              {insights.jobMarketTrend}
            </p>
          </CardContent>
        </Card>

        {/* Salary Growth */}
        <Card className="relative overflow-hidden border-border hover:border-primary-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-16 translate-x-16"></div>
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50">
                <TrendingUp className="w-3 h-3 text-primary-600" />
                <span className="text-[10px] font-semibold text-primary-600">
                  +{insights.avgSalaryGrowth}
                </span>
              </div>
            </div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              Salary Growth
            </p>
            <p className="text-2xl font-bold text-text">
              {insights.avgSalaryGrowth}
            </p>
            <p className="text-xs text-text-muted mt-1">
              Average annual increase
            </p>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card className="relative overflow-hidden border-border hover:border-primary-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-16 translate-x-16"></div>
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-500" />
              </div>
              <Award className="w-4 h-4 text-primary-500" />
            </div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
              In-Demand Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {insights.topSkillsDemand.slice(0, 5).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-[11px] font-medium rounded-md bg-primary-50 text-primary-700 border border-primary-200/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Insights Carousels */}
      <div className="space-y-6">
        {/* Job Demand Carousel */}
        {jobDemandInsights.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                  </div>
                  <CardTitle className="text-base">Job Demand</CardTitle>
                </div>
                <div className="flex gap-2">
                  <button
                    className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => scroll(jobDemandRef, "left")}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => scroll(jobDemandRef, "right")}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                ref={jobDemandRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-invisible"
              >
                {jobDemandInsights.map((insight, idx) => (
                  <Card
                    key={idx}
                    className="w-xs border-border hover:border-primary-500/50 transition-all hover:shadow-md shrink-0"
                  >
                    <CardContent>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <h4 className="text-sm font-semibold text-text flex-1 leading-snug">
                          {insight.trend}
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 ${
                            insight.relevance === "high"
                              ? "bg-primary-100 text-primary-700"
                              : insight.relevance === "medium"
                              ? "bg-primary-50 text-primary-600"
                              : "bg-surface text-text-muted"
                          }`}
                        >
                          {insight.relevance.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {insight.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Growth Carousel */}
        {salaryGrowthInsights.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-primary-500" />
                  </div>
                  <CardTitle className="text-base">Salary Growth</CardTitle>
                </div>
                <div className="flex gap-2">
                  <button
                    className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => scroll(salaryGrowthRef, "left")}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => scroll(salaryGrowthRef, "right")}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                ref={salaryGrowthRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-invisible"
              >
                {salaryGrowthInsights.map((insight, idx) => (
                  <Card
                    key={idx}
                    className="w-xs border-border hover:border-primary-500/50 transition-all hover:shadow-md shrink-0"
                  >
                    <CardContent>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <h4 className="text-sm font-semibold text-text flex-1 leading-snug">
                          {insight.trend}
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 ${
                            insight.relevance === "high"
                              ? "bg-primary-100 text-primary-700"
                              : insight.relevance === "medium"
                              ? "bg-primary-50 text-primary-600"
                              : "bg-surface text-text-muted"
                          }`}
                        >
                          {insight.relevance.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {insight.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emerging Skills Carousel */}
        {emergingSkillInsights.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                  </div>
                  <CardTitle className="text-base">Emerging Skills</CardTitle>
                </div>
                <div className="flex gap-2">
                  <button
                    className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => scroll(emergingSkillsRef, "left")}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => scroll(emergingSkillsRef, "right")}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                ref={emergingSkillsRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-invisible"
              >
                {emergingSkillInsights.map((insight, idx) => (
                  <Card
                    key={idx}
                    className="w-xs border-border hover:border-primary-500/50 transition-all hover:shadow-md shrink-0"
                  >
                    <CardContent>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <h4 className="text-sm font-semibold text-text flex-1 leading-snug">
                          {insight.trend}
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 ${
                            insight.relevance === "high"
                              ? "bg-primary-100 text-primary-700"
                              : insight.relevance === "medium"
                              ? "bg-primary-50 text-primary-600"
                              : "bg-surface text-text-muted"
                          }`}
                        >
                          {insight.relevance.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {insight.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* All Other Insights (if any) */}
      {insights.insights.filter(
        (i) =>
          !["job_demand", "salary_growth", "emerging_skill"].includes(
            i.category
          )
      ).length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Other Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.insights
                .filter(
                  (i) =>
                    !["job_demand", "salary_growth", "emerging_skill"].includes(
                      i.category
                    )
                )
                .map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface/50 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-text">
                            {insight.trend}
                          </h4>
                          <Badge
                            variant="default"
                            size="sm"
                            className={getRelevanceBadgeColor(
                              insight.relevance
                            )}
                          >
                            {insight.relevance}
                          </Badge>
                        </div>
                        <Badge variant="secondary" size="sm" className="mb-2">
                          {getCategoryLabel(insight.category)}
                        </Badge>
                        <p className="text-xs text-text-muted">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simple Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-text-muted">
          Last updated{" "}
          {new Date(insights.generatedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          • Refreshes every 24 hours
        </p>
      </div>
    </div>
  );
}
