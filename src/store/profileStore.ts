/**
 * @file profileStore.ts
 * @description User profile state management with Zustand and Appwrite
 * @dependencies zustand, @/lib/types, @/lib/constants, @/lib/utils, @/lib/db
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Education, Skill, Experience, DocumentMetadata, Project } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { calculateProfileCompletion } from "@/lib/utils";
import { profileService } from "@/lib/db";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
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
  // Database sync methods
  loadProfile: (userId: string, forceRefresh?: boolean) => Promise<void>;
  syncProfile: (userId: string) => Promise<void>;
  createProfile: (userId: string, profile: Profile) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

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
          socialLinks: (profile.socialLinks || []).filter((_, i) => i !== index),
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
          documents: [...(profile.documents || []), document as DocumentMetadata],
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
        
        // Prevent duplicate calls - return early if already loading
        if (currentState.isLoading) {
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
            console.log("✅ Profile loaded from database");
            set({ profile, isLoading: false });
          } else {
            // No profile exists, create a default one
            console.log("📝 No profile found, creating default profile");
            
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
            const newProfileRow = await profileService.create(
              userId,
              defaultProfile
            );
            const createdProfile =
              profileService.mapRowToProfile(newProfileRow);
            console.log("✅ Default profile created with username:", username);
            set({ profile: createdProfile, isLoading: false });
          }
        } catch (error) {
          console.error("❌ Failed to load profile:", error);
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
    }),
    {
      name: STORAGE_KEYS.USER_PROFILE,
    }
  )
);
