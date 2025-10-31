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
  Users,
  UserPlus,
  UserMinus,
  Briefcase,
  GraduationCap,
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
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-text flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              Experience
            </h2>
            <div className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border-2 border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <h3 className="font-bold text-text text-xl mb-2 group-hover:text-primary-600 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-text-muted text-sm mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      {exp.duration}
                    </p>
                    <p className="text-text mb-4 leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.techStack.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            size="sm"
                            className="shadow-sm"
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
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-text flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              Education
            </h2>
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border-2 border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <h3 className="font-bold text-text text-xl mb-2 group-hover:text-primary-600 transition-colors">
                      {edu.degree}
                    </h3>
                    <p className="text-text-muted text-lg mb-3">{edu.school}</p>
                    <div className="flex gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary-500" />
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
          <div className="space-y-6">
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 bg-surface/50 backdrop-blur-sm rounded-2xl p-1.5 border-2 border-border">
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex-1 px-6 py-3 text-base font-semibold rounded-xl transition-all ${
                  activeTab === "projects"
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "text-text-muted hover:text-text hover:bg-background"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("pathways")}
                className={`flex-1 px-6 py-3 text-base font-semibold rounded-xl transition-all ${
                  activeTab === "pathways"
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "text-text-muted hover:text-text hover:bg-background"
                }`}
              >
                Completed Pathways
              </button>
            </div>

            {/* Projects Tab Content */}
            {activeTab === "projects" &&
              profile.projects &&
              profile.projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl bg-surface/50 backdrop-blur-sm border-2 border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        {project.image && (
                          <div className="relative overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.name}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-text group-hover:text-primary-600 transition-colors mb-2">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="text-text-muted text-sm leading-relaxed">
                                {project.description}
                              </p>
                            )}
                          </div>

                          {project.techStack &&
                            project.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    size="sm"
                                    className="shadow-sm"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}

                          {project.url && (
                            <div className="flex gap-3 pt-2">
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                              >
                                <ExternalLink className="w-4 h-4" />
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
      <div className="flex items-center justify-center min-h-[60vh]">
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
    <div className="space-y-8 py-8 px-8">
      {/* Back Button */}

      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/10 via-surface to-primary-600/10 border-2 border-border shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmOGM0MiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-50" />

        <div className="relative pt-12 pb-10 px-8">
          <div className="text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              {profile.userImage ? (
                <img
                  src={profile.userImage}
                  alt={profile.username || "Profile"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl shadow-primary-500/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-4xl font-bold flex items-center justify-center shadow-2xl shadow-primary-500/30">
                  {getUserInitial()}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Username */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-text to-text/80 bg-clip-text text-transparent mb-3">
              {profile.username}
            </h1>

            {/* Bio */}
            {profile.bio && (
              <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Followers/Following/Skills Counts */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="group relative px-6 py-3 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary-500/50 transition-all cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-text">
                    {(() => {
                      const count = profile.followersCount || 0;
                      console.log("Rendering followers count:", count);
                      return count;
                    })()}
                  </span>
                  <span className="text-sm text-text-muted">Followers</span>
                </div>
              </div>
              <div className="group relative px-6 py-3 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary-500/50 transition-all cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-text">
                    {profile.followingCount || 0}
                  </span>
                  <span className="text-sm text-text-muted">Following</span>
                </div>
              </div>
              <div className="group relative px-6 py-3 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary-500/50 transition-all cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-text">
                    {profile.skills?.length || 0}
                  </span>
                  <span className="text-sm text-text-muted">Skills</span>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {user && user.id !== profile.userId && (
              <div className="mb-8">
                <Button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  size="lg"
                  variant={
                    checkIsFollowing(profile.userId) ? "outline" : "primary"
                  }
                  className="shadow-lg"
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
              </div>
            )}

            {/* Location & Website */}
            <div className="flex items-center justify-center gap-6 text-sm text-text-muted mb-8">
              {profile.location && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 backdrop-blur-sm border border-border">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group"
                >
                  <LinkIcon className="w-4 h-4 text-primary-500" />
                  <span className="group-hover:text-primary-500 transition-colors">
                    Website
                  </span>
                </a>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 backdrop-blur-sm border border-border">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span>Joined {getJoinDate()}</span>
              </div>
            </div>

            {/* Social Links */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-3">
                {profile.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border-2 border-border hover:border-primary-500 bg-background/50 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-text-muted hover:text-primary-500 hover:scale-110 hover:shadow-lg group"
                  >
                    {getSocialIcon(link)}
                  </a>
                ))}
              </div>
            )}

            {/* Coding Platform Heatmaps */}
            {(getGithubUsername() ||
              getLeetCodeUsername() ||
              getGFGUsername()) && (
              <div className="mt-8 pt-8 border-t border-border/50 space-y-8">
                {getGithubUsername() && (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <IoLogoGithub className="w-6 h-6 text-primary-500" />
                      <h3 className="text-lg font-semibold text-text">
                        GitHub Contributions
                      </h3>
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
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <SiLeetcode className="w-6 h-6 text-primary-500" />
                      <h3 className="text-lg font-semibold text-text">
                        LeetCode Stats
                      </h3>
                    </div>
                    <div className="flex justify-center overflow-x-auto bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary-500/50 transition-all">
                      <img
                        src={`https://leetcard.jacoblin.cool/${getLeetCodeUsername()}?theme=light&font=Karma&ext=heatmap`}
                        alt="LeetCode Stats"
                        className="w-full max-w-2xl"
                      />
                    </div>
                  </div>
                )}

                {getGFGUsername() && (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <SiGeeksforgeeks className="w-6 h-6 text-primary-500" />
                      <h3 className="text-lg font-semibold text-text">
                        GeeksforGeeks Profile
                      </h3>
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
