"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { profileService } from "@/lib/db";
import type { Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useFollowStore } from "@/store/followStore";
import Link from "next/link";

type TabType = "followers" | "following";

export default function NetworkPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const username = params.username as string;

  const {
    followUser,
    unfollowUser,
    isFollowing: checkIsFollowing,
    loadFollowData,
    loadNetworkProfiles,
  } = useFollowStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("followers");
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [followActionLoading, setFollowActionLoading] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await profileService.getByUsername(username);
        if (data) {
          setProfile(data);

          console.log("Profile data:", {
            followersList: data.followersList,
            followingList: data.followingList,
            followersCount: data.followersCount,
            followingCount: data.followingCount,
          });

          const networkData = await loadNetworkProfiles(data.userId);
          console.log("Network data loaded:", {
            followers: networkData.followers.length,
            following: networkData.following.length,
          });

          setFollowers(networkData.followers as Profile[]);
          setFollowing(networkData.following as Profile[]);

          if (user) {
            await loadFollowData(user.id);
          }
        }
      } catch (error) {
        console.error("Error loading network:", error);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadProfile();
    }
  }, [username, user, loadFollowData, loadNetworkProfiles]);

  const handleFollowToggle = async (targetUserId: string) => {
    if (!user || !profile) return;

    setFollowActionLoading(targetUserId);
    const isCurrentlyFollowing = checkIsFollowing(targetUserId);

    try {
      const result = isCurrentlyFollowing
        ? await unfollowUser(user.id, targetUserId)
        : await followUser(user.id, targetUserId);

      if (result.success) {
        await loadFollowData(user.id);
        
        const networkData = await loadNetworkProfiles(profile.userId);
        setFollowers(networkData.followers as Profile[]);
        setFollowing(networkData.following as Profile[]);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setFollowActionLoading(null);
    }
  };

  const getUserInitial = (userProfile: Profile) => {
    if (userProfile.username) {
      return userProfile.username.charAt(0).toUpperCase();
    }
    return "?";
  };

  const renderUserCard = (userProfile: Profile) => {
    const isCurrentUser = user?.id === userProfile.userId;
    const isFollowingUser = checkIsFollowing(userProfile.userId);
    const isLoading = followActionLoading === userProfile.userId;

    return (
      <Card
        key={userProfile.$id}
        className="border-border hover:border-primary-500 transition-all"
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/${userProfile.username || userProfile.userId}`}
              className="flex items-start gap-4 flex-1 min-w-0"
            >
              {userProfile.userImage ? (
                <img
                  src={userProfile.userImage}
                  alt={userProfile.username || "User"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-border flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-xl flex-shrink-0">
                  {getUserInitial(userProfile)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text text-lg hover:text-primary-500 transition-colors">
                  {userProfile.username || "Anonymous"}
                </h3>
                {userProfile.bio && (
                  <p className="text-sm text-text-muted line-clamp-2 mt-1">
                    {userProfile.bio}
                  </p>
                )}
              </div>
            </Link>

            {user && !isCurrentUser && (
              <Button
                onClick={() => handleFollowToggle(userProfile.userId)}
                disabled={isLoading}
                variant={isFollowingUser ? "outline" : "primary"}
                size="sm"
                className="flex-shrink-0"
              >
                {isLoading
                  ? "..."
                  : isFollowingUser
                  ? "Unfollow"
                  : "Follow"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-h-screen">
            <div className="max-w-4xl mx-auto p-6 md:p-8">
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
                  <p className="text-text-muted">Loading network...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-h-screen">
            <div className="max-w-4xl mx-auto p-6 md:p-8">
              <div className="text-center py-12">
                <p className="text-text-muted">Profile not found</p>
                <Button onClick={() => router.back()} className="mt-4">
                  Go Back
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.userId;
  const pageTitle = isOwnProfile
    ? "My Network"
    : `${profile.username}'s Network`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-h-screen">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-surface rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-text" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-text">{pageTitle}</h1>
                  <p className="text-sm text-text-muted">
                    View connections and network
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 border-b border-border bg-surface rounded-t-xl">
                <button
                  onClick={() => setActiveTab("followers")}
                  className={`px-6 py-4 text-base font-semibold transition-all relative ${
                    activeTab === "followers"
                      ? "text-primary-500"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    FOLLOWERS • {followers.length}
                  </span>
                  {activeTab === "followers" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`px-6 py-4 text-base font-semibold transition-all relative ${
                    activeTab === "following"
                      ? "text-primary-500"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    FOLLOWING • {following.length}
                  </span>
                  {activeTab === "following" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === "followers" && (
                  <>
                    {followers.length === 0 ? (
                      <Card>
                        <CardContent className="py-16 text-center">
                          <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
                          <p className="text-text-muted">No followers yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      followers.map(renderUserCard)
                    )}
                  </>
                )}

                {activeTab === "following" && (
                  <>
                    {following.length === 0 ? (
                      <Card>
                        <CardContent className="py-16 text-center">
                          <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
                          <p className="text-text-muted">Not following anyone yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      following.map(renderUserCard)
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
