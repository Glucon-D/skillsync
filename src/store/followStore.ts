/**
 * @file followStore.ts
 * @description Follow/unfollow state management with Zustand
 * @dependencies zustand, @/lib/db
 */

import { create } from "zustand";
import { profileService } from "@/lib/db";

interface FollowState {
  followingList: string[];
  followersList: string[];
  followingCount: number;
  followersCount: number;
  isLoading: boolean;
  error: string | null;
}

interface FollowActions {
  loadFollowData: (userId: string) => Promise<void>;
  followUser: (currentUserId: string, targetUserId: string) => Promise<{ success: boolean; error?: string }>;
  unfollowUser: (currentUserId: string, targetUserId: string) => Promise<{ success: boolean; error?: string }>;
  isFollowing: (targetUserId: string) => boolean;
  updateLocalFollowState: (targetUserId: string, action: 'follow' | 'unfollow') => void;
  updateFollowCounts: (followersCount: number, followingCount: number) => void;
  resetFollowState: () => void;
}

export const useFollowStore = create<FollowState & FollowActions>((set, get) => ({
  followingList: [],
  followersList: [],
  followingCount: 0,
  followersCount: 0,
  isLoading: false,
  error: null,

  loadFollowData: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.getByUserId(userId);
      if (profile) {
        let followingList: string[] = [];
        let followersList: string[] = [];

        console.log('Raw followingList from DB:', profile.followingList);
        console.log('Raw followersList from DB:', profile.followersList);

        try {
          followingList = profile.followingList ? JSON.parse(profile.followingList) : [];
          console.log('Parsed followingList:', followingList);
        } catch (e) {
          console.error('Error parsing followingList:', e);
          followingList = [];
        }

        try {
          followersList = profile.followersList ? JSON.parse(profile.followersList) : [];
          console.log('Parsed followersList:', followersList);
        } catch (e) {
          console.error('Error parsing followersList:', e);
          followersList = [];
        }

        set({
          followingList,
          followersList,
          followingCount: profile.followingCount || 0,
          followersCount: profile.followersCount || 0,
          isLoading: false,
        });
        
        console.log('Follow store updated:', {
          followingList,
          followersList,
          followingCount: followingList.length,
          followersCount: followersList.length,
        });
      } else {
        set({ isLoading: false, error: "Profile not found" });
      }
    } catch (error) {
      console.error("Failed to load follow data:", error);
      set({ isLoading: false, error: "Failed to load follow data" });
    }
  },

  followUser: async (currentUserId: string, targetUserId: string) => {
    const { followingList } = get();
    
    // Optimistic update
    const newFollowingList = [...followingList, targetUserId];
    set({
      followingList: newFollowingList,
      followingCount: newFollowingList.length,
    });

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserId,
          targetUserId,
          action: 'follow',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update with server data
        set({
          followingCount: data.followingCount,
        });
        return { success: true };
      } else {
        // Revert on error
        set({
          followingList,
          followingCount: followingList.length,
        });
        return { success: false, error: data.error || 'Failed to follow user' };
      }
    } catch (error) {
      console.error("Error following user:", error);
      // Revert on error
      set({
        followingList,
        followingCount: followingList.length,
      });
      return { success: false, error: 'Network error' };
    }
  },

  unfollowUser: async (currentUserId: string, targetUserId: string) => {
    const { followingList } = get();
    
    // Optimistic update
    const newFollowingList = followingList.filter(id => id !== targetUserId);
    set({
      followingList: newFollowingList,
      followingCount: newFollowingList.length,
    });

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserId,
          targetUserId,
          action: 'unfollow',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update with server data
        set({
          followingCount: data.followingCount,
        });
        return { success: true };
      } else {
        // Revert on error
        set({
          followingList,
          followingCount: followingList.length,
        });
        return { success: false, error: data.error || 'Failed to unfollow user' };
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      // Revert on error
      set({
        followingList,
        followingCount: followingList.length,
      });
      return { success: false, error: 'Network error' };
    }
  },

  isFollowing: (targetUserId: string) => {
    const { followingList } = get();
    return followingList.includes(targetUserId);
  },

  updateLocalFollowState: (targetUserId: string, action: 'follow' | 'unfollow') => {
    const { followingList } = get();
    if (action === 'follow') {
      if (!followingList.includes(targetUserId)) {
        const newList = [...followingList, targetUserId];
        set({
          followingList: newList,
          followingCount: newList.length,
        });
      }
    } else {
      const newList = followingList.filter(id => id !== targetUserId);
      set({
        followingList: newList,
        followingCount: newList.length,
      });
    }
  },

  updateFollowCounts: (followersCount: number, followingCount: number) => {
    set({ followersCount, followingCount });
  },

  resetFollowState: () => {
    set({
      followingList: [],
      followersList: [],
      followingCount: 0,
      followersCount: 0,
      isLoading: false,
      error: null,
    });
  },
}));
