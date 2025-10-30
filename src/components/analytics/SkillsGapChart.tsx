/**
 * @file components/analytics/SkillsGapChart.tsx
 * @description Skills gap analysis comparing student skills vs industry demand
 * @dependencies react, recharts, @/components/ui
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface SkillGapData {
  skill: string;
  studentCoverage: number;
  industryDemand: number;
  gap: number;
}

interface SkillsGapChartProps {
  studentSkills: Array<{ name: string; total: number; percentageOfTotal: number }>;
  industryBenchmarks: Array<{ skill: string; demand: number; growth: number }>;
  totalStudents: number;
}

export function SkillsGapChart({ studentSkills, industryBenchmarks, totalStudents }: SkillsGapChartProps) {
  // Create comparison data
  const gapData: SkillGapData[] = industryBenchmarks.map(industry => {
    const studentSkill = studentSkills.find(s => 
      s?.name && industry?.skill && s.name.toLowerCase() === industry.skill.toLowerCase()
    );
    const studentCoverage = studentSkill ? studentSkill.percentageOfTotal : 0;
    const gap = industry.demand - studentCoverage;
    
    return {
      skill: industry.skill || 'Unknown',
      studentCoverage,
      industryDemand: industry.demand,
      gap: Math.max(0, gap),
    };
  }).sort((a, b) => b.gap - a.gap);

  const topGaps = gapData.slice(0, 8);

  return (
    <Card className="border-slate-200/60 dark:border-slate-800 col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Skills Gap Analysis</CardTitle>
              <p className="text-xs text-text-muted mt-1">Student coverage vs industry demand</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Industry Benchmarks</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topGaps} margin={{ top: 10, right: 30, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="skill" 
              angle={-45}
              textAnchor="end"
              height={100}
              className="text-xs text-text-muted"
            />
            <YAxis 
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
              className="text-xs text-text-muted"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `${value}%`}
            />
            <Legend />
            <Bar dataKey="studentCoverage" name="Student Coverage" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="industryDemand" name="Industry Demand" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Gap Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topGaps.slice(0, 4).map((item, idx) => (
            <div 
              key={idx}
              className="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10 rounded-lg border border-red-200 dark:border-red-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-text">{item.skill}</h4>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold rounded">
                  -{item.gap}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Student coverage:</span>
                  <span className="font-semibold text-emerald-600">{item.studentCoverage}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Industry demand:</span>
                  <span className="font-semibold text-blue-600">{item.industryDemand}%</span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                Need {Math.ceil((item.gap * totalStudents) / 100)} more students
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
