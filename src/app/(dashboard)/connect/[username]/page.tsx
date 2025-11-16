/**
 * @file connect/[username]/page.tsx
 * @description User portfolio page viewed from Connect section
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Link as LinkIcon,
  ExternalLink,
  Calendar,
  Mail,
  UserPlus,
  UserMinus,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import {
  SiPeerlist,
  SiLeetcode,
  SiDiscord,
  SiGeeksforgeeks,
} from "react-icons/si";
import { CiLinkedin, CiYoutube } from "react-icons/ci";
import { IoLogoGithub } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { profileService, aiPathwaysService, type AIPathwayRow } from "@/lib/db";
import type { Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { useFollowStore } from "@/store/followStore";

export default function ConnectProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const username = params.username as string;

  const {
    followUser,
    unfollowUser,
    isFollowing: checkIsFollowing,
    loadFollowData,
  } = useFollowStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "pathways">(
    "projects"
  );
  const [completedPathways, setCompletedPathways] = useState<AIPathwayRow[]>(
    []
  );
  const [followLoading, setFollowLoading] = useState(false);

  // Render portfolio content sections
  const renderPortfolioContent = () => {
    if (!profile) return null;

    return (
      <>
        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <div className="space-y-2 px-6">
            <h2 className="text-lg font-bold text-text flex items-center">
              Experience
            </h2>
            <div className="space-y-2">
              {profile.experience.map((exp, index) => (
                <div
                  key={index}
                  className="group relative p-4 bg-surface/50 backdrop-blur-sm rounded-xl border border-border hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-text text-base group-hover:text-primary-600 transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-text-muted text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary-500" />
                        {exp.duration}
                      </p>
                    </div>
                    <p className="text-text-muted text-sm mb-2 leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techStack.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs px-2 py-0.5"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <div className="space-y-2 px-6">
            <h2 className="text-lg font-bold text-text flex items-center gap-3">
              Education
            </h2>
            <div className="space-y-2">
              {profile.education.map((edu, index) => (
                <div
                  key={index}
                  className="group relative p-4 bg-surface/50 backdrop-blur-sm rounded-xl border border-border hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <h3 className="font-bold text-text text-base mb-1 group-hover:text-primary-600 transition-colors">
                      {edu.degree}
                    </h3>
                    <p className="text-text-muted text-sm mb-1">{edu.school}</p>
                    <div className="flex gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary-500" />
                        {edu.year}
                      </span>
                      {edu.gpa && (
                        <span className="font-semibold text-primary-600">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects / Completed Pathways Section */}
        {((profile.projects && profile.projects.length > 0) ||
          completedPathways.length > 0) && (
          <div className="space-y-6 px-6">
            {/* Tab Switcher */}
            <div className="flex items-center justify-center gap-8 border-b border-border">
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-3 text-base font-semibold transition-all relative ${
                  activeTab === "projects"
                    ? "text-primary-500"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Projects ({profile.projects?.length || 0})
                {activeTab === "projects" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("pathways")}
                className={`px-4 py-3 text-base font-semibold transition-all relative ${
                  activeTab === "pathways"
                    ? "text-primary-500"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Completed Pathways ({completedPathways.length})
                {activeTab === "pathways" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                )}
              </button>
            </div>

            {/* Projects Tab Content */}
            {activeTab === "projects" &&
              profile.projects &&
              profile.projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.projects.map((project, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl bg-surface/50 backdrop-blur-sm border border-border hover:border-primary-500/50 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        {project.image && (
                          <div className="relative overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.name}
                              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="text-base font-bold text-text group-hover:text-primary-600 transition-colors mb-1">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="text-text-muted text-xs leading-relaxed">
                                {project.description}
                              </p>
                            )}
                          </div>

                          {project.techStack &&
                            project.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {project.techStack.map((tech, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs px-2 py-0.5"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}

                          {project.url && (
                            <div className="flex gap-2 pt-1">
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>View Project</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Completed Pathways Tab Content */}
            {activeTab === "pathways" && completedPathways.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedPathways.map((pathway) => (
                  <Card key={pathway.$id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{pathway.name}</span>
                        <Badge variant="success" size="sm">
                          Completed
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {pathway.description && (
                        <p className="text-text-muted text-sm">
                          {pathway.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={
                            pathway.level === "advanced"
                              ? "primary"
                              : pathway.level === "intermediate"
                              ? "warning"
                              : "default"
                          }
                        >
                          {pathway.level}
                        </Badge>
                        {pathway.category && (
                          <Badge variant="secondary">{pathway.category}</Badge>
                        )}
                        {pathway.estimatedTime && (
                          <div className="flex items-center text-sm text-text-muted">
                            <Calendar className="w-4 h-4 mr-1" />
                            {pathway.estimatedTime}
                          </div>
                        )}
                      </div>
                      {pathway.completedAt && (
                        <p className="text-xs text-text-muted">
                          Completed on{" "}
                          {new Date(pathway.completedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State for Completed Pathways */}
            {activeTab === "pathways" && completedPathways.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted">No completed pathways yet</p>
              </div>
            )}

            {/* Empty State for Projects */}
            {activeTab === "projects" &&
              (!profile.projects || profile.projects.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-text-muted">No projects to display</p>
                </div>
              )}
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        console.log("Loading profile for username:", username);
        const data = await profileService.getByUsername(username);
        console.log("Profile data received:", data);
        console.log("Followers count:", data?.followersCount);
        console.log("Following count:", data?.followingCount);

        if (data) {
          setProfile(data);
          // Load completed pathways
          if (data.userId) {
            try {
              const pathways = await aiPathwaysService.getAIPathways(
                data.userId
              );
              const completed = pathways.filter((p) => p.completed === true);
              setCompletedPathways(completed);
            } catch (err) {
              console.error("Error loading pathways:", err);
            }
          }

          // Load follow data for current user
          if (user) {
            try {
              await loadFollowData(user.id);
              console.log("Follow data loaded successfully");
            } catch (err) {
              console.error("Error loading follow data:", err);
              // Don't set notFound on follow data error
            }
          }
        } else {
          console.log("No profile found for username:", username);
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error loading portfolio:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleBack = () => {
    router.push(ROUTES.CONNECT);
  };

  const handleFollowToggle = async () => {
    if (!user || !profile) return;

    setFollowLoading(true);
    const isCurrentlyFollowing = checkIsFollowing(profile.userId);
    const previousFollowersCount = profile.followersCount || 0;

    console.log("=== FOLLOW ACTION START ===");
    console.log("Current follow state:", isCurrentlyFollowing);
    console.log("Previous followers count:", previousFollowersCount);

    // Optimistic UI update for followers count
    const optimisticCount = isCurrentlyFollowing
      ? previousFollowersCount - 1
      : previousFollowersCount + 1;
    console.log("Setting optimistic count to:", optimisticCount);

    setProfile({
      ...profile,
      followersCount: optimisticCount,
    });

    try {
      console.log("Calling follow API...");
      const result = isCurrentlyFollowing
        ? await unfollowUser(user.id, profile.userId)
        : await followUser(user.id, profile.userId);

      console.log("Follow API result:", result);

      if (result.success) {
        console.log("Reloading follow data for current user...");
        await loadFollowData(user.id);

        console.log("Fetching updated target profile...");
        const updatedProfile = await profileService.getByUserId(profile.userId);
        console.log(
          "Updated profile followers count:",
          updatedProfile?.followersCount
        );
        console.log(
          "Updated profile following count:",
          updatedProfile?.followingCount
        );

        if (updatedProfile) {
          // Update entire profile with fresh data from server
          console.log("Setting complete updated profile");
          setProfile(updatedProfile);
        }
        console.log("=== FOLLOW ACTION SUCCESS ===");
      } else {
        // Revert on error
        console.error("Follow operation failed:", result.error);
        setProfile({
          ...profile,
          followersCount: previousFollowersCount,
        });
        console.log("=== FOLLOW ACTION FAILED - REVERTED ===");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Revert on error
      setProfile({
        ...profile,
        followersCount: previousFollowersCount,
      });
      console.log("=== FOLLOW ACTION ERROR - REVERTED ===");
    } finally {
      setFollowLoading(false);
    }
  };

  const getUserInitial = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return "?";
  };

  const getJoinDate = () => {
    if (profile?.$createdAt) {
      return new Date(profile.$createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    return "Recently";
  };

  const getSocialIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes("github.com"))
      return <IoLogoGithub className="w-5 h-5" />;
    if (lowerUrl.includes("linkedin.com"))
      return <CiLinkedin className="w-5 h-5" />;
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
      return <RiTwitterXLine className="w-5 h-5" />;
    if (lowerUrl.includes("leetcode.com"))
      return <SiLeetcode className="w-5 h-5" />;
    if (lowerUrl.includes("peerlist.io"))
      return <SiPeerlist className="w-5 h-5" />;
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be"))
      return <CiYoutube className="w-5 h-5" />;
    if (lowerUrl.includes("discord.com") || lowerUrl.includes("discord.gg"))
      return <SiDiscord className="w-5 h-5" />;
    if (lowerUrl.includes("geeksforgeeks.org"))
      return <SiGeeksforgeeks className="w-5 h-5" />;
    if (lowerUrl.includes("mailto:") || lowerUrl.includes("@"))
      return <Mail className="w-5 h-5" />;

    return <LinkIcon className="w-5 h-5" />;
  };

  const getGithubUsername = () => {
    if (!profile?.socialLinks) return null;
    const githubLink = profile.socialLinks.find((link) =>
      link.toLowerCase().includes("github.com")
    );
    if (!githubLink) return null;
    const match = githubLink.match(/github\.com\/([^\/\?#]+)/i);
    return match ? match[1] : null;
  };

  const getLeetCodeUsername = () => {
    if (!profile?.socialLinks) return null;
    const leetcodeLink = profile.socialLinks.find((link) =>
      link.toLowerCase().includes("leetcode.com")
    );
    if (!leetcodeLink) return null;
    const match = leetcodeLink.match(/leetcode\.com\/(?:u\/)?([^\/\?#]+)/i);
    return match ? match[1] : null;
  };

  const getGFGUsername = () => {
    if (!profile?.socialLinks) return null;
    const gfgLink = profile.socialLinks.find(
      (link) =>
        link.toLowerCase().includes("geeksforgeeks.org") ||
        link.toLowerCase().includes("auth.geeksforgeeks.org")
    );
    if (!gfgLink) return null;
    const match = gfgLink.match(/geeksforgeeks\.org\/user\/([^\/\?#]+)/i);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text mb-4">404</h1>
          <p className="text-text-muted mb-6">Portfolio not found</p>
          <Button onClick={handleBack}>Back to Connect</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-6 pb-8">
      {/* Header with Back Button, User Info, and Follow Button */}
      <div className="flex items-center justify-between gap-4 pb-6 pt-4">
        {/* Left: Back Button */}
        <div className="flex gap-2 pt-3">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-primary-50"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
          </Button>

          {/* Center: User Info */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile.userImage ? (
              <img
                src={profile.userImage}
                alt={profile.username || "Profile"}
                className="w-12 h-12 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-lg font-bold flex items-center justify-center">
                {getUserInitial()}
              </div>
            )}

            {/* Username and Stats */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-text">
                {profile.username}
              </h1>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <button
                  onClick={() =>
                    router.push(
                      `/${profile.username || profile.userId}/network`
                    )
                  }
                  className="hover:opacity-75 transition-opacity"
                >
                  <span className="font-semibold text-text">
                    {profile.followersCount || 0}
                  </span>{" "}
                  Followers
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/${profile.username || profile.userId}/network`
                    )
                  }
                  className="hover:opacity-75 transition-opacity"
                >
                  <span className="font-semibold text-text">
                    {profile.followingCount || 0}
                  </span>{" "}
                  Following
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Follow Button */}
        {user && user.id !== profile.userId && (
          <Button
            onClick={handleFollowToggle}
            disabled={followLoading}
            variant={checkIsFollowing(profile.userId) ? "outline" : "primary"}
          >
            {followLoading ? (
              "Loading..."
            ) : checkIsFollowing(profile.userId) ? (
              <>
                <UserMinus className="w-4 h-4 mr-2" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>

      {/* Profile Content Card */}
      <div className="relative overflow-hidden  mb-3 ">
        {/* Background Pattern */}

        <div className="relative pt-8 pb-10 px-8">
          <div className="space-y-3">
            {/* Avatar and Username */}
            <div className="text-center">
              <div className="relative inline-block mb-1">
                {profile.userImage ? (
                  <img
                    src={profile.userImage}
                    alt={profile.username || "Profile"}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 "
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl font-bold flex items-center justify-center shadow-xl shadow-primary-500/30">
                    {getUserInitial()}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-text ">
                {profile.username}
              </h2>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="text-center">
                <p className="text-text-muted text-sm max-w-2xl mx-auto leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-1 text-xs"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Location, Website, Join Date & Non-Coding Social Links */}
            <div className="flex items-center justify-center gap-3 text-sm text-text-muted flex-wrap">
              {profile.location && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 backdrop-blur-sm ">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 backdrop-blur-sm   dark:hover:bg-primary-900/20 transition-all group"
                >
                  <LinkIcon className="w-4 h-4 text-primary-500" />
                  <span>{profile.websiteUrl}</span>
                </a>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 backdrop-blur-sm ">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span>Joined {getJoinDate()}</span>
              </div>

              {/* Non-Coding Platform Social Links */}
            </div>

            <div className="flex items-center justify-center gap-3">
              {profile.socialLinks &&
                profile.socialLinks
                  .filter(
                    (link) =>
                      !link.toLowerCase().includes("github.com") &&
                      !link.toLowerCase().includes("leetcode.com") &&
                      !link.toLowerCase().includes("geeksforgeeks.org")
                  )
                  .map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg border border-border hover:border-primary-500 bg-background/50 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-text-muted hover:text-primary-500 hover:scale-110"
                    >
                      {getSocialIcon(link)}
                    </a>
                  ))}
            </div>

            {/* Coding Platform Heatmaps */}
            {(getGithubUsername() ||
              getLeetCodeUsername() ||
              getGFGUsername()) && (
              <div className=" pt-2 border-t border-border/50 space-y-8">
                {getGithubUsername() && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text">
                        GitHub Contributions
                      </h3>
                      <a
                        href={profile.socialLinks?.find((link) =>
                          link.toLowerCase().includes("github.com")
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border hover:border-primary-500 bg-background/50 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-text-muted hover:text-primary-500"
                      >
                        <IoLogoGithub className="w-5 h-5" />
                      </a>
                    </div>
                    <div className="flex justify-center overflow-x-auto bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary-500/50 transition-all">
                      <img
                        src={`https://ghchart.rshah.org/ff8c42/${getGithubUsername()}`}
                        alt="GitHub Contribution Heatmap"
                        className="w-full max-w-2xl"
                        style={{ imageRendering: "auto" }}
                      />
                    </div>
                  </div>
                )}

                {getLeetCodeUsername() && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text">
                        LeetCode Stats
                      </h3>
                      <a
                        href={profile.socialLinks?.find((link) =>
                          link.toLowerCase().includes("leetcode.com")
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border hover:border-primary-500 bg-background/50 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-text-muted hover:text-primary-500"
                      >
                        <SiLeetcode className="w-5 h-5" />
                      </a>
                    </div>
                    <div className="flex justify-center overflow-x-auto bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary-500/50 transition-all">
                      <img
                        src={`https://leetcard.jacoblin.cool/${getLeetCodeUsername()}?theme=light&font=Karma&ext=heatmap`}
                        alt="LeetCode Stats"
                        className="w-full max-w-lg"
                      />
                    </div>
                  </div>
                )}

                {getGFGUsername() && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text">
                        GeeksforGeeks Profile
                      </h3>
                      <a
                        href={profile.socialLinks?.find(
                          (link) =>
                            link.toLowerCase().includes("geeksforgeeks.org") ||
                            link
                              .toLowerCase()
                              .includes("auth.geeksforgeeks.org")
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border hover:border-primary-500 bg-background/50 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-text-muted hover:text-primary-500"
                      >
                        <SiGeeksforgeeks className="w-5 h-5" />
                      </a>
                    </div>
                    <div className="flex justify-center overflow-x-auto bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary-500/50 transition-all">
                      <img
                        src={`https://geeks-for-geeks-stats-card.vercel.app/?username=${getGFGUsername()}`}
                        alt="GFG Stats"
                        className="w-full max-w-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Content Sections */}
      {renderPortfolioContent()}
    </div>
  );
}
