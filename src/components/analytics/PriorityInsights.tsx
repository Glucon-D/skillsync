/**
 * @file components/analytics/PriorityInsights.tsx
 * @description Top priority actionable insights for curriculum improvement
 * @dependencies react, lucide-react, @/components/ui
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

interface PriorityInsightsProps {
  skillsGap: Array<{ skill: string; gap: number; studentCoverage: number; industryDemand: number }>;
  totalStudents: number;
  profileCompletionRate: number;
  courseCompletionRate: number;
}

export function PriorityInsights({ 
  skillsGap,
  profileCompletionRate,
  courseCompletionRate 
}: PriorityInsightsProps) {
  const topGaps = skillsGap.slice(0, 3);
  
  const insights = [];
  
  // Skills gap insights
  if (topGaps.length > 0) {
    topGaps.forEach(gap => {
      if (gap.gap > 15) {
        insights.push({
          type: 'critical',
          icon: AlertTriangle,
          title: `Critical Skill Gap: ${gap.skill}`,
          description: `Only ${gap.studentCoverage}% of students have this skill, but industry needs ${gap.industryDemand}%`,
          action: `Add ${gap.skill} courses to curriculum`,
          impact: 'High',
        });
      }
    });
  }
  
  // Profile completion insight
  if (profileCompletionRate < 70) {
    insights.push({
      type: 'warning',
      icon: TrendingUp,
      title: 'Low Profile Completion',
      description: `Only ${profileCompletionRate}% average completion - students need guidance`,
      action: 'Simplify onboarding and provide tutorials',
      impact: 'Medium',
    });
  }
  
  // Course completion insight
  if (courseCompletionRate < 50) {
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      title: 'Low Course Completion Rate',
      description: `${courseCompletionRate}% course completion - content may be too difficult`,
      action: 'Review course difficulty and add support materials',
      impact: 'High',
    });
  } else if (courseCompletionRate > 70) {
    insights.push({
      type: 'success',
      icon: CheckCircle2,
      title: 'Strong Course Engagement',
      description: `${courseCompletionRate}% course completion rate - students are engaged!`,
      action: 'Maintain current quality standards',
      impact: 'Positive',
    });
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-text">Priority Actions</h2>
          <p className="text-sm text-text-muted">Top recommendations to improve your curriculum</p>
        </div>
        <span className="px-3 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full">
          {insights.length} insights
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          const bgColor = 
            insight.type === 'critical' ? 'from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10' :
            insight.type === 'warning' ? 'from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10' :
            'from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10';
          
          const iconColor = 
            insight.type === 'critical' ? 'text-red-600' :
            insight.type === 'warning' ? 'text-yellow-600' :
            'text-emerald-600';
          
          const borderColor =
            insight.type === 'critical' ? 'border-red-200 dark:border-red-500/20' :
            insight.type === 'warning' ? 'border-yellow-200 dark:border-yellow-500/20' :
            'border-emerald-200 dark:border-emerald-500/20';

          return (
            <Card key={idx} className={`border ${borderColor} bg-gradient-to-r ${bgColor}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-bold text-text leading-snug">{insight.title}</h3>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase whitespace-nowrap ${
                        insight.impact === 'High' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                        insight.impact === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                        'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {insight.impact}
                      </span>
                    </div>
                    
                    <p className="text-sm text-text-muted mb-3">{insight.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-text">
                      <ArrowRight className="w-4 h-4 text-primary-500" />
                      <span>{insight.action}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
