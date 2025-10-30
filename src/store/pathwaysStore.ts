/**
 * @file pathwaysStore.ts
 * @description Skill pathways and progress state management with Zustand and Appwrite
 * @dependencies zustand, @/lib/types, @/lib/constants, @/lib/db
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SkillPathway } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { pathwaysService } from '@/lib/db';

interface PathwaysState {
  userPathways: Array<{
    pathwayId: string;
    name: string;
    completed: boolean;
    completedAt: string | null;
    $dbId?: string;
  }>;
  isLoading: boolean;
  error: string | null;
}

interface PathwaysActions {
  togglePathwayCompletion: (
    userId: string,
    pathway: SkillPathway
  ) => Promise<void>;
  isPathwayCompleted: (pathwayId: string) => boolean;
  getProgress: (totalPathways: number) => number;
  loadPathways: (userId: string) => Promise<void>;
  addPathway: (userId: string, pathway: SkillPathway) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePathwaysStore = create<PathwaysState & PathwaysActions>()(
  persist(
    (set, get) => ({
      userPathways: [],
      isLoading: false,
      error: null,

      togglePathwayCompletion: async (userId: string, pathway: SkillPathway) => {
        const userPathways = get().userPathways;
        const existingPathway = userPathways.find(
          (p) => p.pathwayId === pathway.id
        );

        if (existingPathway) {
          // Toggle completion status
          const newCompletedStatus = !existingPathway.completed;
          const completedAt = newCompletedStatus ? new Date().toISOString() : null;

          set({
            userPathways: userPathways.map((p) =>
              p.pathwayId === pathway.id
                ? { ...p, completed: newCompletedStatus, completedAt }
                : p
            ),
          });

          // Update in database
          if (existingPathway.$dbId) {
            try {
              await pathwaysService.update(existingPathway.$dbId, {
                completed: newCompletedStatus,
                completedAt,
              });
            } catch (error) {
              console.error('Failed to update pathway:', error);
              set({ error: 'Failed to update pathway' });
            }
          }
        } else {
          // Add new pathway
          await get().addPathway(userId, pathway);
        }
      },

      isPathwayCompleted: (pathwayId: string) => {
        const userPathways = get().userPathways;
        const pathway = userPathways.find((p) => p.pathwayId === pathwayId);
        return pathway?.completed || false;
      },

      getProgress: (totalPathways: number) => {
        const { userPathways } = get();
        const completedCount = userPathways.filter((p) => p.completed).length;
        if (totalPathways === 0) return 0;
        return Math.round((completedCount / totalPathways) * 100);
      },

      loadPathways: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const pathways = await pathwaysService.getByUserId(userId);
          set({
            userPathways: pathways.map((p: any) => ({
              pathwayId: p.pathwayId,
              name: p.name,
              completed: p.completed,
              completedAt: p.completedAt,
              $dbId: p.$id,
            })),
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to load pathways:', error);
          set({ error: 'Failed to load pathways', isLoading: false });
        }
      },

      addPathway: async (userId: string, pathway: SkillPathway) => {
        try {
          const newPathway = await pathwaysService.add(userId, pathway);
          set({
            userPathways: [
              ...get().userPathways,
              {
                pathwayId: newPathway.pathwayId,
                name: newPathway.name,
                completed: newPathway.completed,
                completedAt: newPathway.completedAt,
                $dbId: (newPathway as any).$id,
              },
            ],
          });
        } catch (error) {
          console.error('Failed to add pathway:', error);
          set({ error: 'Failed to add pathway' });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: STORAGE_KEYS.SKILL_PROGRESS,
    }
  )
);
