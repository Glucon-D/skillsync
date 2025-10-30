/**
 * @file components/analytics/ProfileFunnelChart.tsx
 * @description Profile completion funnel visualization
 * @dependencies react, recharts, @/components/ui
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ChevronRight } from 'lucide-react';

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropoff: number;
}

interface ProfileFunnelChartProps {
  data: FunnelStage[];
}

export function ProfileFunnelChart({ data }: ProfileFunnelChartProps) {
  const maxCount = data[0]?.count || 1;

  return (
    <Card className="border-slate-200/60 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Profile Completion Funnel</CardTitle>
            <p className="text-xs text-text-muted mt-1">Student onboarding progression</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((stage, idx) => {
            const width = (stage.count / maxCount) * 100;
            const conversionRate = idx > 0 ? Math.round((stage.count / data[idx - 1].count) * 100) : 100;

            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text">{stage.stage}</span>
                    {idx > 0 && stage.dropoff > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded">
                        -{stage.dropoff} dropoff
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text">{stage.count}</span>
                    <span className="text-xs text-text-muted">({stage.percentage}%)</span>
                  </div>
                </div>

                {/* Funnel Bar */}
                <div className="relative h-12 bg-surface rounded-lg overflow-hidden border border-border">
                  <div
                    className={`h-full flex items-center px-4 transition-all duration-500 ${
                      width > 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                      width > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-orange-500 to-red-500'
                    }`}
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-xs font-semibold text-white">
                      {idx > 0 && `${conversionRate}% conversion`}
                    </span>
                  </div>
                </div>

                {/* Arrow connector */}
                {idx < data.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-text">{data[0]?.count || 0}</p>
            <p className="text-xs text-text-muted mt-1">Total Signups</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {data[data.length - 1]?.count || 0}
            </p>
            <p className="text-xs text-text-muted mt-1">Fully Complete</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {Math.round(((data[data.length - 1]?.count || 0) / (data[0]?.count || 1)) * 100)}%
            </p>
            <p className="text-xs text-text-muted mt-1">Completion Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
