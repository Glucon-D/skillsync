/**
 * @file profileStore.ts
 * @description User profile state management with Zustand
 * @dependencies zustand, @/lib/types, @/lib/constants, @/lib/utils
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, Education, Skill, Experience } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { calculateProfileCompletion } from '@/lib/utils';

interface ProfileState {
  profile: Profile | null;
}

interface ProfileActions {
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  addEducation: (education: Education) => void;
  removeEducation: (index: number) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (index: number) => void;
  addExperience: (experience: Experience) => void;
  removeExperience: (index: number) => void;
  getCompletionPercentage: () => number;
}

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set, get) => ({
      profile: null,

      setProfile: (profile: Profile) => {
        set({ profile });
      },

      updateProfile: (updates: Partial<Profile>) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;
        
        const updatedProfile = { ...currentProfile, ...updates };
        updatedProfile.completionPercentage = calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });
      },

      addEducation: (education: Education) => {
        const profile = get().profile;
        if (!profile) return;
        
        const updatedProfile = {
          ...profile,
          education: [...profile.education, education],
        };
        updatedProfile.completionPercentage = calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });
      },

      removeEducation: (index: number) => {
        const profile = get().profile;
        if (!profile) return;
        
        const updatedProfile = {
          ...profile,
          education: profile.education.filter((_, i) => i !== index),
        };
        updatedProfile.completionPercentage = calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });
      },

      addSkill: (skill: Skill) => {
        const profile = get().profile;
        if (!profile) return;
        
        const updatedProfile = {
          ...profile,
          skills: [...profile.skills, skill],
        };
        updatedProfile.completionPercentage = calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });
      },

      removeSkill: (index: number) => {
        const profile = get().profile;
        if (!profile) return;
        
        const updatedProfile = {
          ...profile,
          skills: profile.skills.filter((_, i) => i !== index),
        };
        updatedProfile.completionPercentage = calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });
      },

      addExperience: (experience: Experience) => {
        const profile = get().profile;
        if (!profile) return;
        
        const updatedProfile = {
          ...profile,
          experience: [...profile.experience, experience],
        };
        updatedProfile.completionPercentage = calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });
      },

      removeExperience: (index: number) => {
        const profile = get().profile;
        if (!profile) return;
        
        const updatedProfile = {
          ...profile,
          experience: profile.experience.filter((_, i) => i !== index),
        };
        updatedProfile.completionPercentage = calculateProfileCompletion(updatedProfile);
        set({ profile: updatedProfile });
      },

      getCompletionPercentage: () => {
        const profile = get().profile;
        return profile ? profile.completionPercentage : 0;
      },
    }),
    {
      name: STORAGE_KEYS.USER_PROFILE,
    }
  )
);
