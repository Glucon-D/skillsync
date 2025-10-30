/**
 * @file assessmentStore.ts
 * @description Assessment quiz state management with Zustand and Appwrite
 * @dependencies zustand, @/lib/types, @/lib/constants, @/lib/db
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentResult, AssessmentScores } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { profileService } from '@/lib/db';

interface AssessmentState {
  currentQuestion: number;
  answers: Record<string, number>;
  result: AssessmentResult | null;
  isCompleted: boolean;
  isSaving: boolean;
  saveError: string | null;
}

interface AssessmentActions {
  setAnswer: (questionId: string, value: number, category: keyof AssessmentScores) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  calculateResults: (userId: string) => Promise<void>;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState & AssessmentActions>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      answers: {},
      result: null,
      isCompleted: false,
      isSaving: false,
      saveError: null,

      setAnswer: (questionId: string, value: number, category: keyof AssessmentScores) => {
        const answers = get().answers;
        set({ answers: { ...answers, [`${questionId}:${category}`]: value } });
      },

      nextQuestion: () => {
        set((state) => ({ currentQuestion: state.currentQuestion + 1 }));
      },

      previousQuestion: () => {
        set((state) => ({ currentQuestion: Math.max(0, state.currentQuestion - 1) }));
      },

      calculateResults: async (userId: string) => {
        const answers = get().answers;
        const scores: AssessmentScores = {
          technical: 0,
          creative: 0,
          analytical: 0,
          leadership: 0,
          communication: 0,
        };

        const categoryCount: Record<keyof AssessmentScores, number> = {
          technical: 0,
          creative: 0,
          analytical: 0,
          leadership: 0,
          communication: 0,
        };

        Object.entries(answers).forEach(([key, value]) => {
          const category = key.split(':')[1] as keyof AssessmentScores;
          scores[category] += value;
          categoryCount[category]++;
        });

        Object.keys(scores).forEach((key) => {
          const category = key as keyof AssessmentScores;
          if (categoryCount[category] > 0) {
            scores[category] = Math.round((scores[category] / categoryCount[category]) * 100) / 100;
          }
        });

        const dominantType = (Object.entries(scores).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0] as string);

        const completedAt = new Date().toISOString();

        const result: AssessmentResult = {
          userId,
          scores,
          dominantType,
          completedAt,
        };

        set({ result, isCompleted: true, isSaving: true, saveError: null });

        // Sync assessment results to user profile
        try {
          console.log('🔍 Syncing assessment results for user:', userId);
          let profile = await profileService.getByUserId(userId);

          if (!profile) {
            // Create profile if it doesn't exist
            console.log('📝 No profile found, creating new profile with assessment data');
            await profileService.create(userId, {
              userId,
              bio: '',
              education: [],
              skills: [],
              experience: [],
              assessmentScores: scores,
              dominantType,
              assessmentCompletedAt: completedAt,
              completionPercentage: 20, // Assessment completed = 20%
            });
            console.log('✅ Profile created with assessment results');
          } else if (profile.$id) {
            // Update existing profile
            console.log('📝 Updating existing profile with assessment data');
            await profileService.update(profile.$id, userId, {
              assessmentScores: scores,
              dominantType,
              assessmentCompletedAt: completedAt,
            });
            console.log('✅ Profile updated with assessment results');
          } else {
            console.error('❌ Profile exists but has no $id:', profile);
            throw new Error('Profile exists but has no ID');
          }
          set({ isSaving: false });
        } catch (error) {
          console.error('❌ Failed to sync assessment results to profile:', error);
          // Log more details about the error
          let errorMessage = 'Failed to save assessment results';
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            errorMessage = error.message;
          }
          set({ isSaving: false, saveError: errorMessage });
        }
      },

      resetAssessment: () => {
        set({
          currentQuestion: 0,
          answers: {},
          result: null,
          isCompleted: false,
          isSaving: false,
          saveError: null,
        });
      },
    }),
    {
      name: STORAGE_KEYS.ASSESSMENT_RESULTS,
    }
  )
);
