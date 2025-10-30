/**
 * @file analytics-utils-enhanced.ts
 * @description Enhanced analytics with detailed metrics and industry comparisons
 * @dependencies @/lib/types
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface EnhancedAnalyticsData {
  // Skills with level distribution
  skillsDetailed: {
    name: string;
    total: number;
    beginner: number;
    intermediate: number;
    advanced: number;
    percentageOfTotal: number;
    trend: 'rising' | 'stable' | 'falling';
  }[];
  
  // Assessment breakdown with distribution
  assessmentDistribution: {
    category: string;
    average: number;
    median: number;
    min: number;
    max: number;
    distribution: {
      range: string;
      count: number;
      percentage: number;
    }[];
  }[];
  
  // Course engagement detailed metrics
  courseEngagement: {
    platformStats: {
      platform: string;
      total: number;
      completed: number;
      completionRate: number;
      avgRating?: number;
    }[];
    difficultyStats: {
      difficulty: string;
      total: number;
      completed: number;
      completionRate: number;
    }[];
    categoryTrends: {
      category: string;
      count: number;
      growth: number;
    }[];
  };
  
  // Profile completion funnel
  profileFunnel: {
    stage: string;
    count: number;
    percentage: number;
    dropoff: number;
  }[];
  
  // Skill level progression
  skillProgression: {
    skill: string;
    beginnerToIntermediate: number;
    intermediateToAdvanced: number;
  }[];
  
  // Top skill combinations
  skillCombinations: {
    skills: string[];
    count: number;
    percentage: number;
  }[];
}

// Calculate skill trends (simplified - would need time-series data for real trends)
export function calculateSkillTrends(profiles: any[]): EnhancedAnalyticsData['skillsDetailed'] {
  const skillMap = new Map<string, { total: number; beginner: number; intermediate: number; advanced: number }>();
  
  profiles.forEach(profile => {
    if (!profile.skills || profile.skills.length === 0) return;
    
    try {
      const skills = typeof profile.skills === 'string' ? JSON.parse(profile.skills) : profile.skills;
      
      skills.forEach((skill: any) => {
        if (!skill || !skill.name) return; // Skip invalid skills
        
        const existing = skillMap.get(skill.name) || { total: 0, beginner: 0, intermediate: 0, advanced: 0 };
        existing.total += 1;
        if (skill.level === 'beginner') existing.beginner += 1;
        else if (skill.level === 'intermediate') existing.intermediate += 1;
        else if (skill.level === 'advanced') existing.advanced += 1;
        skillMap.set(skill.name, existing);
      });
    } catch (error) {
      console.error('Error parsing skills:', error);
    }
  });
  
  const totalProfiles = profiles.length || 1;
  
  return Array.from(skillMap.entries())
    .map(([name, data]) => ({
      name,
      total: data.total,
      beginner: data.beginner,
      intermediate: data.intermediate,
      advanced: data.advanced,
      percentageOfTotal: Math.round((data.total / totalProfiles) * 100),
      trend: 'stable' as const, // Would calculate from historical data
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);
}

// Calculate assessment distribution
export function calculateAssessmentDistribution(profiles: any[]): EnhancedAnalyticsData['assessmentDistribution'] {
  const categories = ['technical', 'creative', 'analytical', 'leadership', 'communication'];
  
  return categories.map(category => {
    const scores: number[] = [];
    
    profiles.forEach(profile => {
      if (!profile.assessmentScores) return;
      
      try {
        const parsed = typeof profile.assessmentScores === 'string' 
          ? JSON.parse(profile.assessmentScores) 
          : profile.assessmentScores;
        
        if (parsed && parsed[category] && typeof parsed[category] === 'number') {
          scores.push(parsed[category]);
        }
      } catch (error) {
        console.error('Error parsing assessment scores:', error);
      }
    });
    
    if (scores.length === 0) {
      return {
        category,
        average: 0,
        median: 0,
        min: 0,
        max: 0,
        distribution: []
      };
    }
    
    scores.sort((a, b) => a - b);
    const median = scores[Math.floor(scores.length / 2)];
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Create distribution buckets
    const buckets = [
      { range: '0-1', min: 0, max: 1 },
      { range: '1-2', min: 1, max: 2 },
      { range: '2-3', min: 2, max: 3 },
      { range: '3-4', min: 3, max: 4 },
      { range: '4-5', min: 4, max: 5 },
    ];
    
    const distribution = buckets.map(bucket => {
      const count = scores.filter(s => s >= bucket.min && s < bucket.max).length;
      return {
        range: bucket.range,
        count,
        percentage: Math.round((count / scores.length) * 100),
      };
    });
    
    return {
      category,
      average: Math.round(average * 10) / 10,
      median: Math.round(median * 10) / 10,
      min: Math.min(...scores),
      max: Math.max(...scores),
      distribution,
    };
  });
}

// Calculate course engagement metrics
export function calculateCourseEngagement(courses: any[]): EnhancedAnalyticsData['courseEngagement'] {
  // Platform stats
  const platformMap = new Map<string, { total: number; completed: number }>();
  const difficultyMap = new Map<string, { total: number; completed: number }>();
  const categoryMap = new Map<string, number>();
  
  courses.forEach(course => {
    // Platform
    const platformData = platformMap.get(course.platform) || { total: 0, completed: 0 };
    platformData.total += 1;
    if (course.completed) platformData.completed += 1;
    platformMap.set(course.platform, platformData);
    
    // Difficulty
    const difficultyData = difficultyMap.get(course.difficulty) || { total: 0, completed: 0 };
    difficultyData.total += 1;
    if (course.completed) difficultyData.completed += 1;
    difficultyMap.set(course.difficulty, difficultyData);
    
    // Category
    if (course.category) {
      categoryMap.set(course.category, (categoryMap.get(course.category) || 0) + 1);
    }
  });
  
  return {
    platformStats: Array.from(platformMap.entries()).map(([platform, data]) => ({
      platform,
      total: data.total,
      completed: data.completed,
      completionRate: Math.round((data.completed / data.total) * 100),
    })).sort((a, b) => b.total - a.total),
    
    difficultyStats: Array.from(difficultyMap.entries()).map(([difficulty, data]) => ({
      difficulty,
      total: data.total,
      completed: data.completed,
      completionRate: Math.round((data.completed / data.total) * 100),
    })).sort((a, b) => b.total - a.total),
    
    categoryTrends: Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      growth: 0, // Would calculate from historical data
    })).sort((a, b) => b.count - a.count).slice(0, 10),
  };
}

// Calculate profile completion funnel
export function calculateProfileFunnel(profiles: any[]): EnhancedAnalyticsData['profileFunnel'] {
  const stages = [
    { stage: 'Signed Up', threshold: 0 },
    { stage: 'Basic Info Added', threshold: 20 },
    { stage: 'Education Added', threshold: 40 },
    { stage: 'Skills Added', threshold: 60 },
    { stage: 'Assessment Completed', threshold: 80 },
    { stage: 'Profile Complete', threshold: 100 },
  ];
  
  const stageCounts = stages.map((stage, index) => {
    const count = profiles.filter(p => {
      const completion = p.completionPercentage || 0;
      return completion >= stage.threshold;
    }).length;
    
    const prevCount = index > 0 ? profiles.filter(p => {
      const completion = p.completionPercentage || 0;
      return completion >= stages[index - 1].threshold;
    }).length : profiles.length;
    
    const dropoff = index > 0 ? prevCount - count : 0;
    
    return {
      stage: stage.stage,
      count,
      percentage: Math.round((count / profiles.length) * 100),
      dropoff,
    };
  });
  
  return stageCounts;
}

// Calculate skill combinations
export function calculateSkillCombinations(profiles: any[]): EnhancedAnalyticsData['skillCombinations'] {
  const combinations = new Map<string, number>();
  
  profiles.forEach(profile => {
    if (!profile.skills || profile.skills.length === 0) return;
    
    try {
      const skills = typeof profile.skills === 'string' ? JSON.parse(profile.skills) : profile.skills;
      const skillNames = skills
        .filter((s: any) => s && s.name) // Filter out invalid skills
        .map((s: any) => s.name)
        .sort();
      
      // Create combinations of 2-3 skills
      for (let i = 0; i < skillNames.length && i < 5; i++) {
        for (let j = i + 1; j < skillNames.length && j < 5; j++) {
          if (skillNames[i] && skillNames[j]) {
            const combo = [skillNames[i], skillNames[j]].join(' + ');
            combinations.set(combo, (combinations.get(combo) || 0) + 1);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing skills for combinations:', error);
    }
  });
  
  const totalProfiles = profiles.length || 1;
  
  return Array.from(combinations.entries())
    .map(([skills, count]) => ({
      skills: skills.split(' + '),
      count,
      percentage: Math.round((count / totalProfiles) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// Industry benchmark data (static for now, would fetch from API in production)
export const industryBenchmarks = {
  topSkills: [
    { skill: 'JavaScript', demand: 85, growth: 12 },
    { skill: 'Python', demand: 82, growth: 18 },
    { skill: 'React', demand: 75, growth: 15 },
    { skill: 'Node.js', demand: 68, growth: 10 },
    { skill: 'TypeScript', demand: 65, growth: 25 },
    { skill: 'AWS', demand: 62, growth: 20 },
    { skill: 'Docker', demand: 58, growth: 22 },
    { skill: 'SQL', demand: 55, growth: 5 },
    { skill: 'Git', demand: 52, growth: 8 },
    { skill: 'MongoDB', demand: 48, growth: 12 },
  ],
  avgSalaryGrowth: '12%',
  jobMarketTrend: 'Strong growth in AI/ML and Cloud Computing sectors',
};
