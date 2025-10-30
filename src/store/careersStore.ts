/**
 * @file careersStore.ts
 * @description Career goals state management with Zustand
 * @dependencies zustand, @/lib/types, @/lib/constants
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Career } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface CareersState {
  selectedCareer: Career | null;
  careerGoals: string[];
}

interface CareersActions {
  setSelectedCareer: (career: Career) => void;
  addCareerGoal: (careerId: string) => void;
  removeCareerGoal: (careerId: string) => void;
  isGoal: (careerId: string) => boolean;
}

export const useCareersStore = create<CareersState & CareersActions>()(
  persist(
    (set, get) => ({
      selectedCareer: null,
      careerGoals: [],

      setSelectedCareer: (career: Career) => {
        set({ selectedCareer: career });
      },

      addCareerGoal: (careerId: string) => {
        const careerGoals = get().careerGoals;
        if (!careerGoals.includes(careerId)) {
          set({ careerGoals: [...careerGoals, careerId] });
        }
      },

      removeCareerGoal: (careerId: string) => {
        const careerGoals = get().careerGoals;
        set({ careerGoals: careerGoals.filter(id => id !== careerId) });
      },

      isGoal: (careerId: string) => {
        return get().careerGoals.includes(careerId);
      },
    }),
    {
      name: STORAGE_KEYS.CAREER_GOALS,
    }
  )
);
