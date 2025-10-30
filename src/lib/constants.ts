/**
 * @file constants.ts
 * @description Application-wide constants and configuration
 * @dependencies none
 */

export const STORAGE_KEYS = {
  AUTH_USER: 'skillsync_auth_user',
  AUTH_TOKEN: 'skillsync_auth_token',
  USER_PROFILE: 'skillsync_user_profile',
  ASSESSMENT_RESULTS: 'skillsync_assessment_results',
  SKILL_PROGRESS: 'skillsync_skill_progress',
  BOOKMARKED_COURSES: 'skillsync_bookmarked_courses',
  CAREER_GOALS: 'skillsync_career_goals',
  THEME: 'skillsync_theme_preference',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',  
  ASSESSMENT: '/assessment',
  PATHWAYS: '/pathways',
  COURSES: '/courses',
  CAREERS: '/careers',
} as const;

export const ASSESSMENT_CATEGORIES = [
  'technical',
  'creative',
  'analytical',
  'leadership',
  'communication',
] as const;

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const COURSE_PLATFORMS = [
  'Coursera',
  'Udemy',
  'YouTube',
  'edX',
  'Pluralsight',
  'LinkedIn Learning',
] as const;
