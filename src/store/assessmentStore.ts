/**
 * @file assessmentStore.ts
 * @description Assessment quiz state management with Zustand
 * @dependencies zustand, @/lib/types, @/lib/constants
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentResult, AssessmentScores } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface AssessmentState {
  currentQuestion: number;
  answers: Record<string, number>;
  result: AssessmentResult | null;
  isCompleted: boolean;
}

interface AssessmentActions {
  setAnswer: (questionId: string, value: number, category: keyof AssessmentScores) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  calculateResults: (userId: string) => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState & AssessmentActions>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      answers: {},
      result: null,
      isCompleted: false,

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

      calculateResults: (userId: string) => {
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

        const result: AssessmentResult = {
          userId,
          scores,
          dominantType,
          completedAt: new Date().toISOString(),
        };

        set({ result, isCompleted: true });
      },

      resetAssessment: () => {
        set({
          currentQuestion: 0,
          answers: {},
          result: null,
          isCompleted: false,
        });
      },
    }),
    {
      name: STORAGE_KEYS.ASSESSMENT_RESULTS,
    }
  )
);
