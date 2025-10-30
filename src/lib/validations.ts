/**
 * @file validations.ts
 * @description Zod validation schemas for forms
 * @dependencies zod
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string({message: 'Email is required'}).email('Invalid email address'),
  password: z.string({message: 'Password is required'}).min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string({message: 'Name is required'}).min(2, 'Name must be at least 2 characters'),
  email: z.string({message: 'Email is required'}).email('Invalid email address'),
  password: z.string({message: 'Password is required'}).min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string({message: 'Confirm password is required'}),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  phone: z.string().optional(),
});

export const educationSchema = z.object({
  school: z.string().min(2, 'School name is required'),
  degree: z.string().min(2, 'Degree is required'),
  year: z.string().min(4, 'Year is required'),
  gpa: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(2, 'Skill name is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export const experienceSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.string().min(2, 'Duration is required'),
  techStack: z.array(z.string()),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
