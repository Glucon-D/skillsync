import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, LOCALDB_KEYS } from '@/lib/constants';
import { aiPathwaysService, type AIPathwayRow } from '@/lib/db';
import { localDB } from '@/lib/localDB';
import type { GeneratedPathwayResponse, SyncOptions } from '@/lib/types';

interface PathwaysState {
  pathways: AIPathwayRow[];
  currentPathway: GeneratedPathwayResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface PathwaysActions {
  setPathways: (pathways: AIPathwayRow[]) => void;
  setCurrentPathway: (pathway: GeneratedPathwayResponse | null) => void;
  addPathway: (pathway: AIPathwayRow) => void;
  updatePathway: (pathwayId: string, updates: Partial<AIPathwayRow>) => void;
  deletePathway: (pathwayId: string) => Promise<void>;
  loadPathways: (userId: string) => Promise<void>;
  loadPathwayById: (userId: string, pathwayId: string) => Promise<void>;
  updateCompletion: (pathwayId: string, completed: boolean) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadFromLocalDB: () => void;
  syncWithAppwrite: (userId: string, options?: SyncOptions) => Promise<void>;
}

export const usePathwaysStore = create<PathwaysState & PathwaysActions>()(
  persist(
    (set, get) => ({
      pathways: [],
      currentPathway: null,
      isLoading: false,
      error: null,

      setPathways: (pathways: AIPathwayRow[]) => {
        set({ pathways, error: null });
      },

      setCurrentPathway: (pathway: GeneratedPathwayResponse | null) => {
        set({ currentPathway: pathway });
      },

      addPathway: (pathway: AIPathwayRow) => {
        const { pathways } = get();
        const existingIndex = pathways.findIndex(p => p.pathwayId === pathway.pathwayId);
        
        let newPathways;
        if (existingIndex !== -1) {
          newPathways = pathways.map(p => p.pathwayId === pathway.pathwayId ? pathway : p);
        } else {
          newPathways = [pathway, ...pathways];
        }
        
        set({ pathways: newPathways });
        localDB.insert(LOCALDB_KEYS.PATHWAYS, pathway);
      },

      updatePathway: (pathwayId: string, updates: Partial<AIPathwayRow>) => {
        const { pathways } = get();
        const newPathways = pathways.map(p => 
          p.pathwayId === pathwayId ? { ...p, ...updates } : p
        );
        
        set({ pathways: newPathways });
        
        const updatedPathway = newPathways.find(p => p.pathwayId === pathwayId);
        if (updatedPathway) {
          localDB.update(LOCALDB_KEYS.PATHWAYS, updatedPathway);
        }
      },

      deletePathway: async (pathwayId: string) => {
        const { pathways } = get();
        const pathway = pathways.find(p => p.pathwayId === pathwayId);
        
        if (!pathway?.$id) return;

        try {
          await aiPathwaysService.delete(pathway.$id);
          
          const newPathways = pathways.filter(p => p.pathwayId !== pathwayId);
          set({ pathways: newPathways });
          
          localDB.remove(LOCALDB_KEYS.PATHWAYS, pathway.$id);
          
          console.log('[PathwaysStore] ✅ Pathway deleted');
        } catch (error) {
          console.error('[PathwaysStore] ❌ Failed to delete pathway:', error);
          set({ error: 'Failed to delete pathway' });
        }
      },

      loadPathways: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const pathways = await aiPathwaysService.getAIPathways(userId);
          set({ pathways, isLoading: false });
          
          localDB.setItems(LOCALDB_KEYS.PATHWAYS, pathways);
        } catch (error) {
          console.error('[PathwaysStore] ❌ Failed to load pathways:', error);
          set({ error: 'Failed to load pathways', isLoading: false });
        }
      },

      loadPathwayById: async (userId: string, pathwayId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const pathwayData = await aiPathwaysService.getAIPathwayById(userId, pathwayId);
          
          if (!pathwayData) {
            set({ error: 'Pathway not found', isLoading: false });
            return;
          }
          
          set({ currentPathway: pathwayData, isLoading: false });
        } catch (error) {
          console.error('[PathwaysStore] ❌ Failed to load pathway:', error);
          set({ error: 'Failed to load pathway', isLoading: false });
        }
      },

      updateCompletion: async (pathwayId: string, completed: boolean) => {
        const { pathways } = get();
        const pathway = pathways.find(p => p.pathwayId === pathwayId);
        
        if (!pathway?.$id) return;

        get().updatePathway(pathwayId, { completed, completedAt: completed ? new Date().toISOString() : null });

        try {
          await aiPathwaysService.updateCompletion(pathway.$id, completed);
          console.log('[PathwaysStore] ✅ Completion status updated');
        } catch (error) {
          console.error('[PathwaysStore] ❌ Failed to update completion:', error);
          
          get().updatePathway(pathwayId, { completed: !completed });
          set({ error: 'Failed to update completion status' });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      loadFromLocalDB: () => {
        console.log('[PathwaysStore] 📂 Loading pathways from LocalDB...');
        
        const pathways = localDB.getAll<AIPathwayRow>(LOCALDB_KEYS.PATHWAYS);
        
        if (pathways.length > 0) {
          console.log(`[PathwaysStore] ✅ Loaded ${pathways.length} pathways from LocalDB`);
          set({ pathways, error: null });
        } else {
          console.log('[PathwaysStore] ⚠️ No pathways found in LocalDB');
        }
      },

      syncWithAppwrite: async (userId: string, options?: SyncOptions) => {
        const { silentSync = true } = options || {};
        
        console.log(`[PathwaysStore] 🔄 Starting Appwrite sync for user: ${userId}`);
        
        if (!silentSync) {
          set({ isLoading: true, error: null });
        }

        try {
          const remotePathways = await aiPathwaysService.getAIPathways(userId);
          
          console.log(`[PathwaysStore] 📥 Received ${remotePathways.length} pathways from Appwrite`);
          
          set({ pathways: remotePathways });
          
          localDB.setItems(LOCALDB_KEYS.PATHWAYS, remotePathways);
          console.log('[PathwaysStore] ✅ Sync complete - Updated Zustand & LocalDB');
          
          if (!silentSync) {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('[PathwaysStore] ❌ Appwrite sync failed:', error);
          set({ 
            error: 'Failed to sync pathways',
            isLoading: false 
          });
        }
      },
    }),
    {
      name: STORAGE_KEYS.SKILL_PROGRESS,
    }
  )
);
