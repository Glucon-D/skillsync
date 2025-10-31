/**
 * @file authStore.ts
 * @description Authentication state management with Zustand and Appwrite
 * @dependencies zustand, @/lib/types, @/lib/appwrite
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";
import { account, ID, OAuthProvider } from "@/lib/appwrite";
import type { Models } from "appwrite";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  setUser: (user: User) => void;
  setHasHydrated: (state: boolean) => void;
  setLoading: (loading: boolean) => void;
}

// Helper to convert Appwrite user to our User type
const convertAppwriteUser = (
  appwriteUser: Models.User<Models.Preferences>
): User => ({
  id: appwriteUser.$id,
  name: appwriteUser.name,
  email: appwriteUser.email,
  createdAt: appwriteUser.$createdAt,
});

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          // Flush any existing sessions first
          try {
            await account.deleteSession({ sessionId: "current" });
          } catch {
            // No active session to delete, continue
          }

          // Create email/password session
          await account.createEmailPasswordSession({
            email,
            password,
          });

          // Get user details
          const appwriteUser = await account.get();
          const user = convertAppwriteUser(appwriteUser);

          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: unknown) {
          console.error("Login error:", error);
          set({ isLoading: false });

          // Return specific error message
          let errorMessage = "Invalid email or password";

          if (typeof error === "object" && error !== null && "code" in error && error.code === 401) {
            errorMessage = "Invalid email or password";
          } else if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
            errorMessage = error.message;
          }

          return { success: false, error: errorMessage };
        }
      },

      signup: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });

          // Flush any existing sessions first
          try {
            await account.deleteSession({ sessionId: "current" });
          } catch {
            // No active session to delete, continue
          }

          // Create account
          await account.create({
            userId: ID.unique(),
            email,
            password,
            name,
          });

          // Automatically log in after signup
          await account.createEmailPasswordSession({
            email,
            password,
          });

          // Get user details
          const appwriteUser = await account.get();
          const user = convertAppwriteUser(appwriteUser);

          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: unknown) {
          console.error("Signup error:", error);
          set({ isLoading: false });

          // Return specific error message
          let errorMessage = "Failed to create account";

          if (typeof error === "object" && error !== null) {
            if (("code" in error && error.code === 409) || ("type" in error && error.type === "user_already_exists")) {
              errorMessage = "Email already exists";
            } else if ("code" in error && error.code === 400) {
              errorMessage = "Invalid email or password format";
            } else if ("message" in error && typeof error.message === "string") {
              errorMessage = error.message;
            }
          }

          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await account.deleteSession({ sessionId: "current" });
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          console.error("Logout error:", error);
          set({ isLoading: false });
        }
      },

      loginWithGoogle: async () => {
        try {
          // Get current origin for redirect URLs
          const origin =
            typeof window !== "undefined" ? window.location.origin : "";

          // Initiate OAuth2 flow
          account.createOAuth2Session({
            provider: OAuthProvider.Google,
            success: `${origin}/auth/callback`,
            failure: `${origin}/login?error=oauth_failed`,
          });
        } catch (error) {
          console.error("Google OAuth error:", error);
          throw error;
        }
      },

      getCurrentUser: async () => {
        try {
          set({ isLoading: true });
          const appwriteUser = await account.get();
          const user = convertAppwriteUser(appwriteUser);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          // User not logged in
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
