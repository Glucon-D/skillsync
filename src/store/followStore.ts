/**
 * @file followStore.ts
 * @description Follow/unfollow state management with Zustand
 * @dependencies zustand, @/lib/db
 */

import { create } from "zustand";
import { profileService } from "@/lib/db";
import { localDB } from "@/lib/localDB";
import { LOCALDB_KEYS } from "@/lib/constants";
import type { SyncOptions } from "@/lib/types";

interface NetworkProfilesCache {
  followers: unknown[];
  following: unknown[];
  cachedAt: string;
}

interface FollowState {
  followingList: string[];
  followersList: string[];
  followingCount: number;
  followersCount: number;
  isLoading: boolean;
  error: string | null;
  followersProfiles: Map<string, { userId: string; username: string; bio: string; userImage: string }>;
  followingProfiles: Map<string, { userId: string; username: string; bio: string; userImage: string }>;
  networkProfilesCache: Record<string, NetworkProfilesCache>;
}

interface FollowActions {
  loadFollowData: (userId: string) => Promise<void>;
  loadNetworkProfiles: (userId: string) => Promise<{ followers: unknown[]; following: unknown[] }>;
  getCachedNetworkProfiles: (userId: string) => { followers: unknown[]; following: unknown[] } | null;
  syncNetworkProfiles: (userId: string, options?: SyncOptions) => Promise<{ followers: unknown[]; following: unknown[] }>;
  followUser: (currentUserId: string, targetUserId: string) => Promise<{ success: boolean; error?: string }>;
  unfollowUser: (currentUserId: string, targetUserId: string) => Promise<{ success: boolean; error?: string }>;
  isFollowing: (targetUserId: string) => boolean;
  updateLocalFollowState: (targetUserId: string, action: 'follow' | 'unfollow') => void;
  updateFollowCounts: (followersCount: number, followingCount: number) => void;
  resetFollowState: () => void;
  getFollowersList: () => string[];
  getFollowingList: () => string[];
  loadFromLocalDB: () => void;
  syncWithAppwrite: (userId: string, options?: SyncOptions) => Promise<void>;
}

export const useFollowStore = create<FollowState & FollowActions>((set, get) => ({
  followingList: [],
  followersList: [],
  followingCount: 0,
  followersCount: 0,
  isLoading: false,
  error: null,
  followersProfiles: new Map(),
  followingProfiles: new Map(),
  networkProfilesCache: {},

  loadFollowData: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.getByUserId(userId);
      if (profile) {
        let followingList: string[] = [];
        let followersList: string[] = [];

        console.log('loadFollowData - Raw data from DB:', {
          followingList: profile.followingList,
          followersList: profile.followersList,
        });

        try {
          followingList = profile.followingList ? JSON.parse(profile.followingList) : [];
          console.log('loadFollowData - Parsed followingList:', followingList);
        } catch (e) {
          console.error('Error parsing followingList, trying CSV format:', e);
          followingList = profile.followingList
            ? profile.followingList.split(",").filter((id: string) => id.trim() !== "")
            : [];
        }

        try {
          followersList = profile.followersList ? JSON.parse(profile.followersList) : [];
          console.log('loadFollowData - Parsed followersList:', followersList);
        } catch (e) {
          console.error('Error parsing followersList, trying CSV format:', e);
          followersList = profile.followersList
            ? profile.followersList.split(",").filter((id: string) => id.trim() !== "")
            : [];
        }

        set({
          followingList,
          followersList,
          followingCount: profile.followingCount || 0,
          followersCount: profile.followersCount || 0,
          isLoading: false,
        });
        
        console.log('loadFollowData - Follow store updated:', {
          followingList,
          followersList,
          followingCount: profile.followingCount,
          followersCount: profile.followersCount,
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
      followersProfiles: new Map(),
      followingProfiles: new Map(),
    });
  },

  loadNetworkProfiles: async (userId: string) => {
    try {
      const profile = await profileService.getByUserId(userId);
      if (!profile) {
        return { followers: [], following: [] };
      }

      console.log('loadNetworkProfiles - Raw data:', {
        followersList: profile.followersList,
        followingList: profile.followingList,
      });

      let followerIds: string[] = [];
      let followingIds: string[] = [];

      try {
        followerIds = profile.followersList
          ? JSON.parse(profile.followersList)
          : [];
      } catch (e) {
        console.error('Error parsing followersList:', e);
        followerIds = profile.followersList
          ? profile.followersList.split(",").filter((id: string) => id.trim() !== "")
          : [];
      }

      try {
        followingIds = profile.followingList
          ? JSON.parse(profile.followingList)
          : [];
      } catch (e) {
        console.error('Error parsing followingList:', e);
        followingIds = profile.followingList
          ? profile.followingList.split(",").filter((id: string) => id.trim() !== "")
          : [];
      }

      console.log('loadNetworkProfiles - Parsed IDs:', {
        followerIds,
        followingIds,
      });

      const followerProfiles = await Promise.all(
        followerIds.map((id: string) => profileService.getByUserId(id.trim()))
      );
      const followingProfiles = await Promise.all(
        followingIds.map((id: string) => profileService.getByUserId(id.trim()))
      );

      const followers = followerProfiles.filter((p) => p !== null);
      const following = followingProfiles.filter((p) => p !== null);

      const followersMap = new Map();
      const followingMap = new Map();

      followers.forEach((p) => {
        if (p) {
          followersMap.set(p.userId, {
            userId: p.userId,
            username: p.username,
            bio: p.bio,
            userImage: p.userImage,
          });
        }
      });

      following.forEach((p) => {
        if (p) {
          followingMap.set(p.userId, {
            userId: p.userId,
            username: p.username,
            bio: p.bio,
            userImage: p.userImage,
          });
        }
      });

      set({
        followersProfiles: followersMap,
        followingProfiles: followingMap,
        followersList: followerIds,
        followingList: followingIds,
      });

      return { followers, following };
    } catch (error) {
      console.error("Error loading network profiles:", error);
      return { followers: [], following: [] };
    }
  },

  getCachedNetworkProfiles: (userId: string) => {
    const cached = get().networkProfilesCache[userId];
    if (!cached) return null;

    const cacheAge = Date.now() - new Date(cached.cachedAt).getTime();
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    if (cacheAge > CACHE_TTL) {
      console.log('[FollowStore] ⏰ Network cache expired for user:', userId);
      return null;
    }

    console.log('[FollowStore] ✅ Using cached network profiles for user:', userId);
    return { followers: cached.followers, following: cached.following };
  },

  syncNetworkProfiles: async (userId: string, options?: SyncOptions) => {
    const { forceRefresh = false } = options || {};

    console.log('[FollowStore] 🔄 Syncing network profiles for user:', userId);

    const cached = get().getCachedNetworkProfiles(userId);

    if (!forceRefresh && cached) {
      console.log('[FollowStore] ⚡ Using cached network profiles (within TTL)');
      return cached;
    }

    try {
      const profile = await profileService.getByUserId(userId);
      if (!profile) {
        return { followers: [], following: [] };
      }

      let followerIds: string[] = [];
      let followingIds: string[] = [];

      try {
        followerIds = profile.followersList
          ? JSON.parse(profile.followersList)
          : [];
      } catch {
        followerIds = profile.followersList
          ? profile.followersList.split(",").filter((id: string) => id.trim() !== "")
          : [];
      }

      try {
        followingIds = profile.followingList
          ? JSON.parse(profile.followingList)
          : [];
      } catch {
        followingIds = profile.followingList
          ? profile.followingList.split(",").filter((id: string) => id.trim() !== "")
          : [];
      }

      const followerProfiles = await Promise.all(
        followerIds.map((id: string) => profileService.getByUserId(id.trim()))
      );
      const followingProfiles = await Promise.all(
        followingIds.map((id: string) => profileService.getByUserId(id.trim()))
      );

      const followers = followerProfiles.filter((p) => p !== null);
      const following = followingProfiles.filter((p) => p !== null);

      const followersMap = new Map();
      const followingMap = new Map();

      followers.forEach((p) => {
        if (p) {
          followersMap.set(p.userId, {
            userId: p.userId,
            username: p.username,
            bio: p.bio,
            userImage: p.userImage,
          });
        }
      });

      following.forEach((p) => {
        if (p) {
          followingMap.set(p.userId, {
            userId: p.userId,
            username: p.username,
            bio: p.bio,
            userImage: p.userImage,
          });
        }
      });

      set({
        followersProfiles: followersMap,
        followingProfiles: followingMap,
        followersList: followerIds,
        followingList: followingIds,
        networkProfilesCache: {
          ...get().networkProfilesCache,
          [userId]: {
            followers,
            following,
            cachedAt: new Date().toISOString(),
          },
        },
      });

      console.log('[FollowStore] ✅ Network profiles synced and cached');
      return { followers, following };
    } catch (error) {
      console.error('[FollowStore] ❌ Failed to sync network profiles:', error);
      return cached || { followers: [], following: [] };
    }
  },

  getFollowersList: () => {
    return get().followersList;
  },

  getFollowingList: () => {
    return get().followingList;
  },

  loadFromLocalDB: () => {
    console.log('[FollowStore] 📂 Loading follow data from LocalDB...');
    
    interface FollowData {
      followingList: string[];
      followersList: string[];
      followingCount: number;
      followersCount: number;
    }
    
    const followDataList = localDB.getAll<FollowData>(LOCALDB_KEYS.FOLLOWS);
    
    if (followDataList.length > 0) {
      const data = followDataList[0];
      console.log('[FollowStore] ✅ Loaded follow data from LocalDB');
      set({
        followingList: data.followingList || [],
        followersList: data.followersList || [],
        followingCount: data.followingCount || 0,
        followersCount: data.followersCount || 0,
        error: null,
      });
    } else {
      console.log('[FollowStore] ⚠️ No follow data found in LocalDB');
    }
  },

  syncWithAppwrite: async (userId: string, options?: SyncOptions) => {
    const { silentSync = true } = options || {};
    
    console.log(`[FollowStore] 🔄 Starting Appwrite sync for user: ${userId}`);
    
    if (!silentSync) {
      set({ isLoading: true, error: null });
    }

    try {
      const profile = await profileService.getByUserId(userId);
      
      if (profile) {
        console.log('[FollowStore] 📥 Received follow data from Appwrite');
        
        let followingList: string[] = [];
        let followersList: string[] = [];

        try {
          followingList = profile.followingList ? JSON.parse(profile.followingList) : [];
        } catch {
          followingList = profile.followingList
            ? profile.followingList.split(",").filter((id: string) => id.trim() !== "")
            : [];
        }

        try {
          followersList = profile.followersList ? JSON.parse(profile.followersList) : [];
        } catch {
          followersList = profile.followersList
            ? profile.followersList.split(",").filter((id: string) => id.trim() !== "")
            : [];
        }

        const followData = {
          followingList,
          followersList,
          followingCount: profile.followingCount || 0,
          followersCount: profile.followersCount || 0,
        };

        set({
          ...followData,
          isLoading: false,
        });
        
        localDB.setItems(LOCALDB_KEYS.FOLLOWS, [followData]);
        console.log('[FollowStore] ✅ Sync complete - Updated Zustand & LocalDB');
      } else {
        console.log('[FollowStore] ⚠️ No profile found on Appwrite');
        if (!silentSync) {
          set({ isLoading: false, error: 'Profile not found' });
        }
      }
    } catch (error) {
      console.error('[FollowStore] ❌ Appwrite sync failed:', error);
      set({ 
        error: 'Failed to sync follow data',
        isLoading: false 
      });
    }
  },
}));
