/**
 * @file profileStore.ts
 * @description User profile state management with Zustand and Appwrite
 * @dependencies zustand, @/lib/types, @/lib/constants, @/lib/utils, @/lib/db
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Profile,
  Education,
  Skill,
  Experience,
  DocumentMetadata,
  Project,
  SyncOptions,
} from "@/lib/types";
import { STORAGE_KEYS, LOCALDB_KEYS } from "@/lib/constants";
import { calculateProfileCompletion } from "@/lib/utils";
import { profileService } from "@/lib/db";
import { localDB } from "@/lib/localDB";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  cachedProfiles: Record<string, { profile: Profile; cachedAt: string }>;
  allUsers: Profile[];
  allUsersLastFetch: string | null;
}

interface ProfileActions {
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  addEducation: (education: Education) => Promise<void>;
  updateEducation: (index: number, education: Education) => Promise<void>;
  removeEducation: (index: number) => Promise<void>;
  addSkill: (skill: Skill) => Promise<void>;
  removeSkill: (index: number) => Promise<void>;
  addExperience: (experience: Experience) => Promise<void>;
  updateExperience: (index: number, experience: Experience) => Promise<void>;
  removeExperience: (index: number) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (index: number, project: Project) => Promise<void>;
  removeProject: (index: number) => Promise<void>;
  addSocialLink: (link: string) => Promise<void>;
  removeSocialLink: (index: number) => Promise<void>;
  addDocument: (document: DocumentMetadata | string) => Promise<void>;
  removeDocument: (index: number) => Promise<void>;
  getCompletionPercentage: () => number;
  loadProfile: (userId: string, forceRefresh?: boolean) => Promise<void>;
  syncProfile: (userId: string) => Promise<void>;
  createProfile: (userId: string, profile: Profile) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetProfile: () => void;
  loadFromLocalDB: () => void;
  syncWithAppwrite: (userId: string, options?: SyncOptions) => Promise<void>;
  getCachedProfile: (userId: string) => Profile | null;
  getCachedProfileByUsername: (username: string) => Profile | null;
  cacheProfile: (profile: Profile) => void;
  loadProfileByUserId: (userId: string) => Promise<Profile | null>;
  loadProfileByUsername: (username: string) => Promise<Profile | null>;
  syncProfileByUsername: (username: string, options?: SyncOptions) => Promise<Profile | null>;
  loadAllUsersFromLocalDB: () => void;
  syncAllUsersWithAppwrite: (options?: SyncOptions) => Promise<void>;
  getAllUsers: () => Profile[];
}

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      cachedProfiles: {},
      allUsers: [],
      allUsersLastFetch: null,

      setProfile: (profile: Profile) => {
        set({ profile, error: null });
      },

      updateProfile: async (updates: Partial<Profile>) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;

        const updatedProfile = { ...currentProfile, ...updates };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database if profile has $id (exists in database)
        if (currentProfile.$id && currentProfile.userId) {
          try {
            await profileService.update(
              currentProfile.$id,
              currentProfile.userId,
              updatedProfile
            );
          } catch (error) {
            console.error("Failed to sync profile update:", error);
            set({ error: "Failed to save profile changes" });
          }
        }
      },

      addEducation: async (education: Education) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          education: [...profile.education, education],
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              education: updatedProfile.education,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync education:", error);
          }
        }
      },

      updateEducation: async (index: number, education: Education) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedEducation = [...profile.education];
        updatedEducation[index] = education;

        const updatedProfile = {
          ...profile,
          education: updatedEducation,
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              education: updatedProfile.education,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync education update:", error);
          }
        }
      },

      removeEducation: async (index: number) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          education: profile.education.filter((_, i) => i !== index),
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              education: updatedProfile.education,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync education removal:", error);
          }
        }
      },

      addSkill: async (skill: Skill) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          skills: [...profile.skills, skill],
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              skills: updatedProfile.skills,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync skill:", error);
          }
        }
      },

      removeSkill: async (index: number) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          skills: profile.skills.filter((_, i) => i !== index),
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              skills: updatedProfile.skills,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync skill removal:", error);
          }
        }
      },

      addExperience: async (experience: Experience) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          experience: [...profile.experience, experience],
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              experience: updatedProfile.experience,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync experience:", error);
          }
        }
      },

      updateExperience: async (index: number, experience: Experience) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedExperience = [...profile.experience];
        updatedExperience[index] = experience;

        const updatedProfile = {
          ...profile,
          experience: updatedExperience,
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              experience: updatedProfile.experience,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync experience update:", error);
          }
        }
      },

      removeExperience: async (index: number) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          experience: profile.experience.filter((_, i) => i !== index),
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              experience: updatedProfile.experience,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync experience removal:", error);
          }
        }
      },

      addProject: async (project: Project) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          projects: [...(profile.projects || []), project],
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              projects: updatedProfile.projects,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync project:", error);
          }
        }
      },

      updateProject: async (index: number, project: Project) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProjects = [...(profile.projects || [])];
        updatedProjects[index] = project;

        const updatedProfile = {
          ...profile,
          projects: updatedProjects,
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              projects: updatedProfile.projects,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync project update:", error);
          }
        }
      },

      removeProject: async (index: number) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          projects: (profile.projects || []).filter((_, i) => i !== index),
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              projects: updatedProfile.projects,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync project removal:", error);
          }
        }
      },

      addSocialLink: async (link: string) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          socialLinks: [...(profile.socialLinks || []), link],
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              socialLinks: updatedProfile.socialLinks,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync social link:", error);
          }
        }
      },

      removeSocialLink: async (index: number) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          socialLinks: (profile.socialLinks || []).filter(
            (_, i) => i !== index
          ),
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              socialLinks: updatedProfile.socialLinks,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync social link removal:", error);
          }
        }
      },

      addDocument: async (document: DocumentMetadata | string) => {
        const profile = get().profile;
        if (!profile) return;

        // Add document to the array in memory
        const updatedProfile = {
          ...profile,
          documents: [
            ...(profile.documents || []),
            document as DocumentMetadata,
          ],
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database - db.ts will handle JSON string conversion
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              documents: updatedProfile.documents,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync document:", error);
          }
        }
      },

      removeDocument: async (index: number) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          documents: (profile.documents || []).filter((_, i) => i !== index),
        };
        updatedProfile.completionPercentage =
          calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });

        // Sync to database - db.ts will handle JSON string conversion
        if (profile.$id && profile.userId) {
          try {
            await profileService.update(profile.$id, profile.userId, {
              documents: updatedProfile.documents,
              completionPercentage: updatedProfile.completionPercentage,
            });
          } catch (error) {
            console.error("Failed to sync document removal:", error);
          }
        }
      },

      getCompletionPercentage: () => {
        const profile = get().profile;
        return profile ? profile.completionPercentage : 0;
      },

      // Database sync methods
      loadProfile: async (userId: string, forceRefresh: boolean = false) => {
        const currentState = get();

        // Prevent duplicate calls - return early if already loading (unless force refresh)
        if (currentState.isLoading && !forceRefresh) {
          console.log("⏳ Profile already loading, skipping...");
          return;
        }

        // Skip if profile exists and not forcing refresh
        if (currentState.profile?.userId === userId && !forceRefresh) {
          console.log("✅ Profile already loaded, skipping...");
          return;
        }

        if (forceRefresh) {
          console.log("🔄 Force refreshing profile for user:", userId);
        }

        set({ isLoading: true, error: null });

        try {
          console.log("🔍 Loading profile for user:", userId);
          const profile = await profileService.getByUserId(userId);

          if (profile) {
            // Documents are already parsed by db.ts
            console.log("✅ Profile loaded from database:", profile);
            set({ profile, isLoading: false });
          } else {
            // No profile exists, create a default one
            console.log("📝 No profile found, creating default profile");

            try {
              // Get user email from auth store to extract username
              const { useAuthStore } = await import("./authStore");
              const user = useAuthStore.getState().user;
              const username = user?.email ? user.email.split("@")[0] : "";

              const defaultProfile: Profile = {
                userId,
                username,
                bio: "",
                education: [],
                skills: [],
                experience: [],
                completionPercentage: 0,
              };

              // Create in database
              console.log("📝 Creating profile in database...");
              const newProfileRow = await profileService.create(
                userId,
                defaultProfile
              );
              const createdProfile =
                profileService.mapRowToProfile(newProfileRow);
              console.log(
                "✅ Default profile created with username:",
                username
              );
              set({ profile: createdProfile, isLoading: false });
            } catch (createError) {
              console.error(
                "❌ Failed to create default profile:",
                createError
              );
              // Set a minimal profile to unblock the UI
              const fallbackProfile: Profile = {
                userId,
                username: "",
                bio: "",
                education: [],
                skills: [],
                experience: [],
                completionPercentage: 0,
              };
              set({
                profile: fallbackProfile,
                isLoading: false,
                error: "Failed to create profile in database",
              });
            }
          }
        } catch (error) {
          console.error("❌ Failed to load profile:", error);
          // Always set loading to false, even on error
          set({ error: "Failed to load profile", isLoading: false });
        }
      },

      syncProfile: async (userId: string) => {
        const profile = get().profile;
        if (!profile) return;

        try {
          if (profile.$id) {
            // Update existing profile
            await profileService.update(profile.$id, userId, profile);
          } else {
            // Create new profile
            await get().createProfile(userId, profile);
          }
        } catch (error) {
          console.error("Failed to sync profile:", error);
          set({ error: "Failed to sync profile" });
        }
      },

      createProfile: async (userId: string, profile: Profile) => {
        set({ isLoading: true, error: null });
        try {
          const newProfile = await profileService.create(userId, profile);
          const mappedProfile = profileService.mapRowToProfile(newProfile);
          set({ profile: mappedProfile, isLoading: false });
        } catch (error) {
          console.error("Failed to create profile:", error);
          set({ error: "Failed to create profile", isLoading: false });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      resetProfile: () => {
        set({ profile: null, isLoading: false, error: null });
      },

      loadFromLocalDB: () => {
        console.log('[ProfileStore] 📂 Loading profile from LocalDB...');
        
        const profiles = localDB.getAll<Profile>(LOCALDB_KEYS.PROFILES);
        
        if (profiles.length > 0) {
          const profile = profiles[0];
          console.log('[ProfileStore] ✅ Loaded profile from LocalDB');
          set({ profile, error: null });
        } else {
          console.log('[ProfileStore] ⚠️ No profile found in LocalDB');
        }
      },

      syncWithAppwrite: async (userId: string, options?: SyncOptions) => {
        const { forceRefresh = false, silentSync = true } = options || {};
        
        console.log(`[ProfileStore] 🔄 Starting Appwrite sync for user: ${userId}`);
        
        if (!silentSync) {
          set({ isLoading: true, error: null });
        }

        try {
          const remoteProfile = await profileService.getByUserId(userId);
          
          if (remoteProfile) {
            console.log('[ProfileStore] 📥 Received profile from Appwrite');
            
            const currentProfile = get().profile;
            
            if (forceRefresh || !currentProfile || remoteProfile.$updatedAt !== currentProfile.$updatedAt) {
              set({ profile: remoteProfile });
              
              localDB.setItems(LOCALDB_KEYS.PROFILES, [remoteProfile]);
              console.log('[ProfileStore] ✅ Sync complete - Updated Zustand & LocalDB');
            } else {
              console.log('[ProfileStore] ℹ️ Profile unchanged, skipping update');
            }
          } else {
            console.log('[ProfileStore] ⚠️ No profile found on Appwrite');
          }
          
          if (!silentSync) {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('[ProfileStore] ❌ Appwrite sync failed:', error);
          set({ 
            error: 'Failed to sync profile',
            isLoading: false 
          });
        }
      },

      getCachedProfile: (userId: string) => {
        const cached = get().cachedProfiles[userId];
        if (!cached) return null;
        
        const cacheAge = Date.now() - new Date(cached.cachedAt).getTime();
        const CACHE_TTL = 5 * 60 * 1000;
        
        if (cacheAge > CACHE_TTL) {
          console.log('[ProfileStore] ⏰ Cache expired for user:', userId);
          return null;
        }
        
        console.log('[ProfileStore] ✅ Using cached profile for user:', userId);
        return cached.profile;
      },

      getCachedProfileByUsername: (username: string) => {
        const { cachedProfiles } = get();
        for (const userId in cachedProfiles) {
          const cached = cachedProfiles[userId];
          if (cached.profile.username === username) {
            const cacheAge = Date.now() - new Date(cached.cachedAt).getTime();
            const CACHE_TTL = 5 * 60 * 1000;
            
            if (cacheAge > CACHE_TTL) {
              console.log('[ProfileStore] ⏰ Cache expired for username:', username);
              return null;
            }
            
            console.log('[ProfileStore] ✅ Using cached profile for username:', username);
            return cached.profile;
          }
        }
        return null;
      },

      cacheProfile: (profile: Profile) => {
        const { cachedProfiles } = get();
        const newCache = { ...cachedProfiles };
        
        newCache[profile.userId] = {
          profile,
          cachedAt: new Date().toISOString(),
        };
        
        // Limit cache size to 10 profiles (LRU)
        const keys = Object.keys(newCache);
        if (keys.length > 10) {
          delete newCache[keys[0]];
        }
        
        set({ cachedProfiles: newCache });
        console.log('[ProfileStore] 📦 Cached profile for user:', profile.userId);
      },

      loadProfileByUserId: async (userId: string) => {
        console.log('[ProfileStore] 🔍 Loading profile by userId:', userId);
        
        const cached = get().getCachedProfile(userId);
        if (cached) return cached;
        
        try {
          const profile = await profileService.getByUserId(userId);
          if (profile) {
            get().cacheProfile(profile);
            return profile;
          }
          return null;
        } catch (error) {
          console.error('[ProfileStore] ❌ Failed to load profile:', error);
          return null;
        }
      },

      loadProfileByUsername: async (username: string) => {
        console.log('[ProfileStore] 🔍 Loading profile by username:', username);
        
        try {
          const profile = await profileService.getByUsername(username);
          if (profile) {
            get().cacheProfile(profile);
            return profile;
          }
          return null;
        } catch (error) {
          console.error('[ProfileStore] ❌ Failed to load profile:', error);
          return null;
        }
      },

      syncProfileByUsername: async (username: string, options?: SyncOptions) => {
        const { silentSync = true, forceRefresh = false } = options || {};
        
        console.log('[ProfileStore] 🔄 Syncing profile by username:', username);
        
        const cached = get().getCachedProfileByUsername(username);
        
        if (!forceRefresh && cached) {
          console.log('[ProfileStore] ⚡ Using cached profile (within TTL)');
          return cached;
        }
        
        try {
          const profile = await profileService.getByUsername(username);
          if (profile) {
            get().cacheProfile(profile);
            console.log('[ProfileStore] ✅ Profile synced and cached');
            return profile;
          }
          return null;
        } catch (error) {
          console.error('[ProfileStore] ❌ Failed to sync profile:', error);
          return cached || null;
        }
      },

      loadAllUsersFromLocalDB: () => {
        console.log('[ProfileStore] 📂 Loading all users from LocalDB...');
        
        const users = localDB.getAll<Profile>(LOCALDB_KEYS.ALL_USERS);
        
        if (users.length > 0) {
          const lastSync = localDB.getLastSync(LOCALDB_KEYS.ALL_USERS);
          console.log(`[ProfileStore] ✅ Loaded ${users.length} users from LocalDB (last sync: ${lastSync})`);
          set({ allUsers: users, allUsersLastFetch: lastSync });
        } else {
          console.log('[ProfileStore] ⚠️ No users found in LocalDB');
        }
      },

      syncAllUsersWithAppwrite: async (options?: SyncOptions) => {
        const { silentSync = true, forceRefresh = false } = options || {};
        
        console.log('[ProfileStore] 🔄 Starting all users sync with Appwrite');
        
        const lastFetch = get().allUsersLastFetch;
        const now = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000;
        
        if (!forceRefresh && lastFetch) {
          const timeSinceLastFetch = now - new Date(lastFetch).getTime();
          if (timeSinceLastFetch < CACHE_DURATION) {
            console.log('[ProfileStore] ℹ️ Users cache is fresh, skipping sync');
            return;
          }
        }

        if (!silentSync) {
          set({ isLoading: true, error: null });
        }

        try {
          const { tablesDB } = await import('@/lib/appwrite');
          const { DATABASE_ID, COLLECTIONS } = await import('@/lib/constants');
          
          const response = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTIONS.USERPROFILES,
            queries: [],
          });

          const users = (response.rows as Record<string, unknown>[]).map((row): Profile => {
            const parseJsonArray = (arr: unknown): unknown[] => {
              if (!Array.isArray(arr)) return [];
              return arr.map((item) => {
                if (typeof item === "string") {
                  try {
                    return JSON.parse(item);
                  } catch {
                    return item;
                  }
                }
                return item;
              });
            };

            return {
              userId: row.userId as string,
              username: (row.username as string) || "",
              userImage: (row.userImage as string) || "",
              bio: (row.bio as string) || "",
              location: (row.location as string) || "",
              websiteUrl: (row.websiteUrl as string) || "",
              socialLinks: Array.isArray(row.socialLinks) ? row.socialLinks as string[] : [],
              education: parseJsonArray(row.education),
              skills: parseJsonArray(row.skills),
              experience: parseJsonArray(row.experience),
              projects: parseJsonArray(row.projects),
              documents: [],
              followersCount: (row.followersCount as number) || 0,
              followingCount: (row.followingCount as number) || 0,
              completionPercentage: (row.completionPercentage as number) || 0,
              $id: row.$id as string,
              $createdAt: row.$createdAt as string,
              $updatedAt: row.$updatedAt as string,
            } as Profile;
          });

          console.log(`[ProfileStore] 📥 Received ${users.length} users from Appwrite`);
          
          set({ 
            allUsers: users, 
            allUsersLastFetch: new Date().toISOString() 
          });
          
          localDB.setItems(LOCALDB_KEYS.ALL_USERS, users);
          console.log('[ProfileStore] ✅ All users sync complete - Updated Zustand & LocalDB');
          
          if (!silentSync) {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('[ProfileStore] ❌ All users sync failed:', error);
          set({ 
            error: 'Failed to sync users',
            isLoading: false 
          });
        }
      },

      getAllUsers: () => {
        return get().allUsers;
      },
    }),
    {
      name: STORAGE_KEYS.USER_PROFILE,
    }
  )
);
