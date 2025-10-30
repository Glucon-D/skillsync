/**
 * @file pathwaysStore.ts
 * @description Skill pathways and progress state management with Zustand
 * @dependencies zustand, @/lib/types, @/lib/constants
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SkillPathway } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface PathwaysState {
  completedSkills: string[];
  pathways: SkillPathway[];
}

interface PathwaysActions {
  toggleSkillCompletion: (skillId: string) => void;
  isSkillCompleted: (skillId: string) => boolean;
  getProgress: () => number;
  setPathways: (pathways: SkillPathway[]) => void;
}

export const usePathwaysStore = create<PathwaysState & PathwaysActions>()(
  persist(
    (set, get) => ({
      completedSkills: [],
      pathways: [],

      toggleSkillCompletion: (skillId: string) => {
        const completedSkills = get().completedSkills;
        if (completedSkills.includes(skillId)) {
          set({ completedSkills: completedSkills.filter(id => id !== skillId) });
        } else {
          set({ completedSkills: [...completedSkills, skillId] });
        }
      },

      isSkillCompleted: (skillId: string) => {
        return get().completedSkills.includes(skillId);
      },

      getProgress: () => {
        const { completedSkills, pathways } = get();
        if (pathways.length === 0) return 0;
        return Math.round((completedSkills.length / pathways.length) * 100);
      },

      setPathways: (pathways: SkillPathway[]) => {
        set({ pathways });
      },
    }),
    {
      name: STORAGE_KEYS.SKILL_PROGRESS,
    }
  )
);
