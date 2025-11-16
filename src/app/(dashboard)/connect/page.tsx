/**
 * @file connect/page.tsx
 * @description Connect page showing all users with search and filter capabilities
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Loader2,
  Search,
  UserPlus,
  UserMinus,
  X,
  MapPin,
  Briefcase,
  Filter,
} from "lucide-react";
import { type Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useFollowStore } from "@/store/followStore";
import { useProfileStore } from "@/store/profileStore";

export default function ConnectPage() {
  const { user } = useAuth();
  const {
    followUser,
    unfollowUser,
    isFollowing: checkIsFollowing,
    loadFollowData,
    loadFromLocalDB: loadFollowsFromLocalDB,
    syncWithAppwrite: syncFollowsWithAppwrite,
  } = useFollowStore();

  const { getAllUsers, loadAllUsersFromLocalDB, syncAllUsersWithAppwrite } =
    useProfileStore();

  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followActionLoading, setFollowActionLoading] = useState<string | null>(
    null
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [jobTitleSearchQuery, setJobTitleSearchQuery] = useState("");

  const users = getAllUsers();

  useEffect(() => {
    console.log("[Connect] 🚀 Page loaded");

    loadAllUsersFromLocalDB();
    setIsLoading(false);

    loadFollowsFromLocalDB();

    if (user) {
      syncAllUsersWithAppwrite({ silentSync: true }).then(() => {
        console.log("[Connect] ✅ Users sync completed");
      });

      syncFollowsWithAppwrite(user.id, { silentSync: true }).then(() => {
        console.log("[Connect] ✅ Follows sync completed");
      });
    }
  }, [
    user,
    loadAllUsersFromLocalDB,
    syncAllUsersWithAppwrite,
    loadFollowsFromLocalDB,
    syncFollowsWithAppwrite,
  ]);

  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    users.forEach((u) => {
      u.skills?.forEach((skill) => {
        if (skill?.name && typeof skill.name === "string") {
          skillsSet.add(skill.name);
        }
      });
    });
    return Array.from(skillsSet).sort();
  }, [users]);

  const allLocations = useMemo(() => {
    const locationsSet = new Set<string>();
    users.forEach((u) => {
      if (u.location && typeof u.location === "string") {
        locationsSet.add(u.location);
      }
    });
    return Array.from(locationsSet).sort();
  }, [users]);

  const allJobTitles = useMemo(() => {
    const titlesSet = new Set<string>();
    users.forEach((u) => {
      u.experience?.forEach((exp) => {
        if (exp?.title && typeof exp.title === "string") {
          titlesSet.add(exp.title);
        }
      });
    });
    return Array.from(titlesSet).sort();
  }, [users]);

  useEffect(() => {
    let filtered = users;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.username?.toLowerCase().includes(query) ||
          u.bio?.toLowerCase().includes(query) ||
          u.location?.toLowerCase().includes(query) ||
          u.skills?.some((skill) => skill.name.toLowerCase().includes(query))
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((u) =>
        selectedSkills.some((skill) => u.skills?.some((s) => s.name === skill))
      );
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((u) =>
        selectedLocations.includes(u.location || "")
      );
    }

    if (selectedJobTitles.length > 0) {
      filtered = filtered.filter((u) =>
        selectedJobTitles.some((title) =>
          u.experience?.some((exp) => exp.title === title)
        )
      );
    }

    setFilteredUsers(filtered);
  }, [
    searchQuery,
    users,
    selectedSkills,
    selectedLocations,
    selectedJobTitles,
  ]);

  const getUserInitial = (userProfile: Profile) => {
    if (userProfile.username) {
      return userProfile.username.charAt(0).toUpperCase();
    }
    return "?";
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const toggleJobTitle = (title: string) => {
    setSelectedJobTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const clearAllFilters = () => {
    setSelectedSkills([]);
    setSelectedLocations([]);
    setSelectedJobTitles([]);
    setSkillSearchQuery("");
    setLocationSearchQuery("");
    setJobTitleSearchQuery("");
  };

  const filteredSkills = useMemo(() => {
    if (!skillSearchQuery.trim()) return allSkills;
    return allSkills.filter((skill) =>
      skill?.toLowerCase().includes(skillSearchQuery.toLowerCase())
    );
  }, [allSkills, skillSearchQuery]);

  const filteredLocations = useMemo(() => {
    if (!locationSearchQuery.trim()) return allLocations;
    return allLocations.filter((location) =>
      location?.toLowerCase().includes(locationSearchQuery.toLowerCase())
    );
  }, [allLocations, locationSearchQuery]);

  const filteredJobTitles = useMemo(() => {
    if (!jobTitleSearchQuery.trim()) return allJobTitles;
    return allJobTitles.filter((title) =>
      title?.toLowerCase().includes(jobTitleSearchQuery.toLowerCase())
    );
  }, [allJobTitles, jobTitleSearchQuery]);

  const handleFollowToggle = async (targetUserId: string) => {
    if (!user) return;

    setFollowActionLoading(targetUserId);
    const isCurrentlyFollowing = checkIsFollowing(targetUserId);

    try {
      const result = isCurrentlyFollowing
        ? await unfollowUser(user.id, targetUserId)
        : await followUser(user.id, targetUserId);

      if (result.success) {
        await loadFollowData(user.id);
        await syncAllUsersWithAppwrite({ silentSync: true });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setFollowActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Loader2 className="w-20 h-20 text-primary-500 animate-spin" />
            <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">
            Loading users...
          </h3>
          <p className="text-text-muted">Discovering the community</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] overflow-hidden p-8">
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-invisible space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text tracking-tight">
                Connect
              </h1>
              <p className="text-sm text-text-muted max-w-2xl">
                Discover and connect with other learners in the community
              </p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary-500 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search by username, bio, location, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm rounded-full border-2 border-border bg-background focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 hover:border-primary-400"
          />
        </div>

        {/* Search Bar */}

        {/* Active Filters */}
        {(selectedSkills.length > 0 ||
          selectedLocations.length > 0 ||
          selectedJobTitles.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-text-muted">Active filters:</span>
            {selectedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {selectedLocations.map((location) => (
              <Badge
                key={location}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleLocation(location)}
              >
                {location}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {selectedJobTitles.map((title) => (
              <Badge
                key={title}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleJobTitle(title)}
              >
                {title}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                {searchQuery ? "No users found" : "No users yet"}
              </h3>
              <p className="text-text-muted">
                {searchQuery
                  ? "Try adjusting your search filters"
                  : "Be the first to join the community!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map((userProfile) => {
              const isCurrentUser = user?.id === userProfile.userId;
              const isFollowingUser = checkIsFollowing(userProfile.userId);
              const isLoadingAction =
                followActionLoading === userProfile.userId;

              return (
                <Card
                  key={userProfile.$id}
                  className="border-border hover:border-primary-500 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        href={`/connect/${
                          userProfile.username || userProfile.userId
                        }`}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        {userProfile.userImage ? (
                          <img
                            src={userProfile.userImage}
                            alt={userProfile.username || "User"}
                            className="w-14 h-14 rounded-full object-cover shrink-0 "
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-lg shrink-0">
                            {getUserInitial(userProfile)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text text-base hover:text-primary-500 transition-colors truncate">
                            {userProfile.username || "Anonymous"}
                          </h3>
                          {userProfile.bio && (
                            <p className="text-sm text-text-muted line-clamp-1 mt-0.5">
                              {userProfile.bio}
                            </p>
                          )}
                        </div>
                      </Link>

                      {user && !isCurrentUser && (
                        <Button
                          onClick={() => handleFollowToggle(userProfile.userId)}
                          disabled={isLoadingAction}
                          variant={isFollowingUser ? "outline" : "primary"}
                          size="sm"
                          className="shrink-0 min-w-[90px]"
                        >
                          {isLoadingAction
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
            })}
          </div>
        )}
      </div>

      {/* Right Sidebar - Filters (Fixed) */}
      <aside className="lg:block lg:w-80 shrink-0 overflow-y-auto scrollbar-invisible">
        <Card className="shadow-lg border-border/50">
          <CardContent className="p-4">
            {/* Main Header with Clear All */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-500" />
                Filters
              </h2>
              {(selectedSkills.length > 0 ||
                selectedLocations.length > 0 ||
                selectedJobTitles.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1 transition-all duration-200 hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5 flex items-center gap-2">
                  Skills
                </label>
                <div className="relative">
                  <div className="min-h-[42px] w-full px-3 py-2 bg-background border-2 border-border rounded-xl focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all duration-200 hover:border-primary-400 flex flex-wrap gap-2 items-center">
                    {selectedSkills.map((skill, index) => (
                      <span
                        key={`selected-${index}`}
                        className="flex items-center gap-1.5 bg-linear-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full shadow-sm text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && filteredSkills.length > 0) {
                          e.preventDefault();
                          toggleSkill(filteredSkills[0]);
                          setSkillSearchQuery("");
                        } else if (
                          e.key === "Backspace" &&
                          !skillSearchQuery &&
                          selectedSkills.length > 0
                        ) {
                          toggleSkill(
                            selectedSkills[selectedSkills.length - 1]
                          );
                        }
                      }}
                      placeholder={
                        selectedSkills.length === 0
                          ? "Type to search skills..."
                          : ""
                      }
                      className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-text placeholder:text-text-muted text-sm"
                    />
                  </div>

                  {filteredSkills.length > 0 && skillSearchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-surface border-2 border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredSkills.slice(0, 5).map((skill, index) => (
                        <button
                          key={`suggestion-${index}`}
                          type="button"
                          onClick={() => {
                            toggleSkill(skill);
                            setSkillSearchQuery("");
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5 flex items-center gap-2">
                  Location
                </label>
                <div className="relative">
                  <div className="min-h-[42px] w-full px-3 py-2 bg-background border-2 border-border rounded-xl focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all duration-200 hover:border-primary-400 flex flex-wrap gap-2 items-center">
                    {selectedLocations.map((location, index) => (
                      <span
                        key={`selected-${index}`}
                        className="flex items-center gap-1.5 bg-linear-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full shadow-sm text-sm font-medium"
                      >
                        {location}
                        <button
                          type="button"
                          onClick={() => toggleLocation(location)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={locationSearchQuery}
                      onChange={(e) => setLocationSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && filteredLocations.length > 0) {
                          e.preventDefault();
                          toggleLocation(filteredLocations[0]);
                          setLocationSearchQuery("");
                        } else if (
                          e.key === "Backspace" &&
                          !locationSearchQuery &&
                          selectedLocations.length > 0
                        ) {
                          toggleLocation(
                            selectedLocations[selectedLocations.length - 1]
                          );
                        }
                      }}
                      placeholder={
                        selectedLocations.length === 0
                          ? "Type to search locations..."
                          : ""
                      }
                      className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-text placeholder:text-text-muted text-sm"
                    />
                  </div>

                  {filteredLocations.length > 0 && locationSearchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-surface border-2 border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredLocations.slice(0, 5).map((location, index) => (
                        <button
                          key={`suggestion-${index}`}
                          type="button"
                          onClick={() => {
                            toggleLocation(location);
                            setLocationSearchQuery("");
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Job Title Filter */}
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5 flex items-center gap-2">
                  Job Title
                </label>
                <div className="relative">
                  <div className="min-h-[42px] w-full px-3 py-2 bg-background border-2 border-border rounded-xl focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all duration-200 hover:border-primary-400 flex flex-wrap gap-2 items-center">
                    {selectedJobTitles.map((title, index) => (
                      <span
                        key={`selected-${index}`}
                        className="flex items-center gap-1.5 bg-linear-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full shadow-sm text-sm font-medium"
                      >
                        {title}
                        <button
                          type="button"
                          onClick={() => toggleJobTitle(title)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={jobTitleSearchQuery}
                      onChange={(e) => setJobTitleSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && filteredJobTitles.length > 0) {
                          e.preventDefault();
                          toggleJobTitle(filteredJobTitles[0]);
                          setJobTitleSearchQuery("");
                        } else if (
                          e.key === "Backspace" &&
                          !jobTitleSearchQuery &&
                          selectedJobTitles.length > 0
                        ) {
                          toggleJobTitle(
                            selectedJobTitles[selectedJobTitles.length - 1]
                          );
                        }
                      }}
                      placeholder={
                        selectedJobTitles.length === 0
                          ? "Type to search job titles..."
                          : ""
                      }
                      className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-text placeholder:text-text-muted text-sm"
                    />
                  </div>

                  {filteredJobTitles.length > 0 && jobTitleSearchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-surface border-2 border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredJobTitles.slice(0, 5).map((title, index) => (
                        <button
                          key={`suggestion-${index}`}
                          type="button"
                          onClick={() => {
                            toggleJobTitle(title);
                            setJobTitleSearchQuery("");
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors truncate"
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
