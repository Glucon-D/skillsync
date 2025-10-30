/**
 * @file profileStore.ts
 * @description User profile state management with Zustand and Appwrite
 * @dependencies zustand, @/lib/types, @/lib/constants, @/lib/utils, @/lib/db
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Education, Skill, Experience, DocumentMetadata } from "@/lib/types";
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
  removeEducation: (index: number) => Promise<void>;
  addSkill: (skill: Skill) => Promise<void>;
  removeSkill: (index: number) => Promise<void>;
  addExperience: (experience: Experience) => Promise<void>;
  removeExperience: (index: number) => Promise<void>;
  addDocument: (document: DocumentMetadata | string) => Promise<void>;
  removeDocument: (index: number) => Promise<void>;
  getCompletionPercentage: () => number;
  // Database sync methods
  loadProfile: (userId: string) => Promise<void>;
  syncProfile: (userId: string) => Promise<void>;
  createProfile: (userId: string, profile: Profile) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
      loadProfile: async (userId: string) => {
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
            const defaultProfile: Profile = {
              userId,
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
            console.log("✅ Default profile created");
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
    }),
    {
      name: STORAGE_KEYS.USER_PROFILE,
    }
  )
);
