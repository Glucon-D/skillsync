/**
 * @file types.ts
 * @description Core TypeScript interfaces and types for SkillSync
 * @dependencies none
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Education {
  school: string;
  degree: string;
  year: string;
  gpa?: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface Experience {
  title: string;
  description: string;
  duration: string;
  techStack: string[];
}

export interface Profile {
  userId: string;
  bio: string;
  phone?: string;
  education: Education[];
  skills: Skill[];
  experience: Experience[];
  documents?: string[];
  assessmentScores?: AssessmentScores;
  dominantType?: string;
  assessmentCompletedAt?: string | null;
  completionPercentage: number;
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface AssessmentScores {
  technical: number;
  creative: number;
  analytical: number;
  leadership: number;
  communication: number;
}

export interface AssessmentResult {
  userId: string;
  scores: AssessmentScores;
  dominantType: string;
  completedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: keyof AssessmentScores;
}

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  platform: string;
  instructor?: string;
  duration?: string;
  difficulty: CourseDifficulty;
  price: number;
  rating: number;
  url: string;
  category?: string;
  $dbId?: string; // Database row ID for updates/deletes
  $createdAt?: string; // Creation timestamp from Appwrite
}

export type GrowthPotential = 'low' | 'medium' | 'high';

export interface Career {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  salaryRange: string;
  growthPotential: GrowthPotential;
  matchPercentage?: number;
}

export interface SkillPathway {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  estimatedTime: string;
  resources: string[];
  completed: boolean;
}

export interface OnboardingData {
  name: string;
  email: string;
  bio: string;
  education: Education[];
  skills: Skill[];
  interests: string[];
  quickAssessment: Record<string, number>;
}
