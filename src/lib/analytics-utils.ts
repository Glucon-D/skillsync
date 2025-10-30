/**
 * @file analytics-utils.ts
 * @description Utility functions for aggregating student data into analytics insights
 * @dependencies @/lib/types
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AssessmentScores, Skill } from './types';

export interface AnalyticsData {
  overview: {
    totalStudents: number;
    avgProfileCompletion: number;
    totalCourses: number;
    courseCompletionRate: number;
    totalPathways: number;
    pathwayCompletionRate: number;
  };
  skills: {
    name: string;
    count: number;
    percentage: number;
    byLevel: {
      beginner: number;
      intermediate: number;
      advanced: number;
    };
  }[];
  careers: {
    type: string;
    count: number;
    percentage: number;
  }[];
  assessments: {
    category: string;
    average: number;
    count: number;
  }[];
  courses: {
    byPlatform: { platform: string; count: number }[];
    byDifficulty: { difficulty: string; count: number }[];
    byCategory: { category: string; count: number }[];
    completionTrend: { completed: number; inProgress: number; bookmarked: number };
  };
  pathways: {
    byCategory: { category: string; count: number }[];
    byLevel: { level: string; count: number }[];
    completionStats: { completed: number; inProgress: number };
  };
}

export function aggregateSkills(profiles: any[]): AnalyticsData['skills'] {
  const skillMap = new Map<string, { count: number; beginner: number; intermediate: number; advanced: number }>();

  profiles.forEach((profile) => {
    if (!profile.skills || profile.skills.length === 0) return;

    const skills: Skill[] = typeof profile.skills === 'string' ? JSON.parse(profile.skills) : profile.skills;

    skills.forEach((skill) => {
      const existing = skillMap.get(skill.name) || { count: 0, beginner: 0, intermediate: 0, advanced: 0 };
      existing.count += 1;
      existing[skill.level] += 1;
      skillMap.set(skill.name, existing);
    });
  });

  const totalStudents = profiles.length || 1;

  return Array.from(skillMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      percentage: Math.round((data.count / totalStudents) * 100),
      byLevel: {
        beginner: data.beginner,
        intermediate: data.intermediate,
        advanced: data.advanced,
      },
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

export function aggregateCareers(profiles: any[]): AnalyticsData['careers'] {
  const typeCounts = new Map<string, number>();

  profiles.forEach((profile) => {
    if (profile.dominantType) {
      typeCounts.set(profile.dominantType, (typeCounts.get(profile.dominantType) || 0) + 1);
    }
  });

  const total = profiles.length || 1;

  return Array.from(typeCounts.entries())
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateAssessments(profiles: any[]): AnalyticsData['assessments'] {
  const scoreAccumulator: Record<keyof AssessmentScores, number[]> = {
    technical: [],
    creative: [],
    analytical: [],
    leadership: [],
    communication: [],
  };

  profiles.forEach((profile) => {
    if (!profile.assessmentScores) return;

    const scores: AssessmentScores = typeof profile.assessmentScores === 'string' 
      ? JSON.parse(profile.assessmentScores) 
      : profile.assessmentScores;

    Object.keys(scoreAccumulator).forEach((key) => {
      const category = key as keyof AssessmentScores;
      if (scores[category] !== undefined) {
        scoreAccumulator[category].push(scores[category]);
      }
    });
  });

  return Object.entries(scoreAccumulator).map(([category, values]) => ({
    category,
    average: values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0,
    count: values.length,
  }));
}

export function aggregateCourses(courses: any[]): AnalyticsData['courses'] {
  const platformMap = new Map<string, number>();
  const difficultyMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();
  let completed = 0;
  let bookmarked = 0;

  courses.forEach((course) => {
    platformMap.set(course.platform, (platformMap.get(course.platform) || 0) + 1);
    difficultyMap.set(course.difficulty, (difficultyMap.get(course.difficulty) || 0) + 1);
    
    if (course.category) {
      categoryMap.set(course.category, (categoryMap.get(course.category) || 0) + 1);
    }

    if (course.completed) completed += 1;
    if (course.bookmarked) bookmarked += 1;
  });

  return {
    byPlatform: Array.from(platformMap.entries())
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count),
    byDifficulty: Array.from(difficultyMap.entries())
      .map(([difficulty, count]) => ({ difficulty, count }))
      .sort((a, b) => b.count - a.count),
    byCategory: Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    completionTrend: {
      completed,
      inProgress: bookmarked - completed,
      bookmarked,
    },
  };
}

export function aggregatePathways(pathways: any[]): AnalyticsData['pathways'] {
  const categoryMap = new Map<string, number>();
  const levelMap = new Map<string, number>();
  let completed = 0;

  pathways.forEach((pathway) => {
    if (pathway.category) {
      categoryMap.set(pathway.category, (categoryMap.get(pathway.category) || 0) + 1);
    }
    if (pathway.level) {
      levelMap.set(pathway.level, (levelMap.get(pathway.level) || 0) + 1);
    }
    if (pathway.completed) {
      completed += 1;
    }
  });

  return {
    byCategory: Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
    byLevel: Array.from(levelMap.entries())
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => b.count - a.count),
    completionStats: {
      completed,
      inProgress: pathways.length - completed,
    },
  };
}

export function calculateAverage(items: any[], field: string): number {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + (item[field] || 0), 0);
  return Math.round((sum / items.length) * 10) / 10;
}

export function calculateCompletionRate(items: any[]): number {
  if (items.length === 0) return 0;
  const completed = items.filter((item) => item.completed).length;
  return Math.round((completed / items.length) * 100);
}
