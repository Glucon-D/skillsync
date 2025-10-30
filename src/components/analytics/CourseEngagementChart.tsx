/**
 * @file components/analytics/CourseEngagementChart.tsx
 * @description Detailed course engagement metrics with multiple visualizations
 * @dependencies react, recharts, @/components/ui
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

interface CourseEngagementProps {
  platformStats: Array<{
    platform: string;
    total: number;
    completed: number;
    completionRate: number;
  }>;
  difficultyStats: Array<{
    difficulty: string;
    total: number;
    completed: number;
    completionRate: number;
  }>;
}

export function CourseEngagementChart({ platformStats, difficultyStats }: CourseEngagementProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Platform Completion Rates */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Course Platform Performance</CardTitle>
              <p className="text-xs text-text-muted mt-1">Completion rates by platform</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformStats} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="platform"
                angle={-45}
                textAnchor="end"
                height={80}
                className="text-xs text-text-muted"
              />
              <YAxis className="text-xs text-text-muted" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="total" name="Total Courses" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Platform Stats Cards */}
          <div className="mt-4 space-y-2">
            {platformStats.slice(0, 3).map((platform, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    idx === 0 ? 'bg-yellow-100 dark:bg-yellow-500/20' :
                    idx === 1 ? 'bg-gray-100 dark:bg-gray-500/20' :
                    'bg-orange-100 dark:bg-orange-500/20'
                  }`}>
                    <Award className={`w-4 h-4 ${
                      idx === 0 ? 'text-yellow-600' :
                      idx === 1 ? 'text-gray-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{platform.platform}</p>
                    <p className="text-xs text-text-muted">{platform.total} courses</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-text">{platform.completionRate}%</p>
                  <p className="text-xs text-text-muted">completion</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Completion Rates */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Completion by Difficulty</CardTitle>
              <p className="text-xs text-text-muted mt-1">Student success across levels</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={difficultyStats} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="difficulty"
                className="text-xs text-text-muted capitalize"
              />
              <YAxis className="text-xs text-text-muted" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="completionRate" name="Rate (%)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>

          {/* Difficulty Insights */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {difficultyStats.map((diff, idx) => (
              <div key={idx} className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-lg border border-indigo-200 dark:border-indigo-500/20">
                <p className="text-xs font-medium text-text-muted uppercase mb-1">{diff.difficulty}</p>
                <p className="text-2xl font-bold text-text mb-1">{diff.completionRate}%</p>
                <p className="text-[10px] text-text-muted">{diff.completed}/{diff.total} completed</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
