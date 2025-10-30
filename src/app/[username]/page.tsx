/**
 * @file [username]/page.tsx
 * @description Public portfolio showcase page
 * @dependencies react, lucide-react, @/lib/db, @/lib/types, @/hooks/useAuth
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Calendar,
  Award,
} from "lucide-react";
import { profileService } from "@/lib/db";
import type { Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";

export default function PortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const username = params.username as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Render portfolio content sections
  const renderPortfolioContent = () => {
    if (!profile) return null;

    return (
      <>
        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant={
                      skill.level === "advanced"
                        ? "primary"
                        : skill.level === "intermediate"
                        ? "warning"
                        : "default"
                    }
                  >
                    {skill.name}
                    {skill.level && ` • ${skill.level}`}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((project, index) => (
                <Card key={index} hover>
                  <CardContent className="space-y-4 p-0">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-6 space-y-4">
                      <div>
                        <CardTitle className="text-lg">
                          {project.name}
                        </CardTitle>
                        {project.description && (
                          <p className="text-text-muted text-sm mt-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, idx) => (
                            <Badge key={idx} variant="secondary" size="sm">
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
                            className="flex items-center gap-1 text-sm text-text-muted hover:text-primary-500 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Project</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text">Experience</h2>
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-text text-lg mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-text-muted text-sm mb-3">
                      {exp.duration}
                    </p>
                    <p className="text-text mb-3">{exp.description}</p>
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.techStack.map((tech, idx) => (
                          <Badge key={idx} variant="secondary" size="sm">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text">Education</h2>
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-text">{edu.degree}</h3>
                    <p className="text-text-muted">{edu.school}</p>
                    <div className="flex gap-4 mt-2 text-sm text-text-muted">
                      <span>{edu.year}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileService.getByUsername(username);
        if (data) {
          setProfile(data);
        } else {
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
  }, [username]);

  const handleBack = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
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
    if (url.includes("github.com")) return <Github className="w-5 h-5" />;
    if (url.includes("linkedin.com")) return <Linkedin className="w-5 h-5" />;
    if (url.includes("twitter.com") || url.includes("x.com"))
      return <Twitter className="w-5 h-5" />;
    return <LinkIcon className="w-5 h-5" />;
  };

  if (loading) {
    // Show loading within dashboard layout for authenticated users
    if (user) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex pt-16">
            <Sidebar />
            <main className="flex-1 overflow-y-auto min-h-screen">
              <div className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-muted">Loading portfolio...</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }

    // Show full-screen loading for unauthenticated users
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    // Show 404 within dashboard layout for authenticated users
    if (user) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex pt-16">
            <Sidebar />
            <main className="flex-1 overflow-y-auto min-h-screen">
              <div className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-text mb-4">404</h1>
                    <p className="text-text-muted mb-6">Portfolio not found</p>
                    <Button onClick={handleBack}>Go Back</Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }

    // Show full-screen 404 for unauthenticated users
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text mb-4">404</h1>
          <p className="text-text-muted mb-6">Portfolio not found</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // If user is authenticated, render as a dashboard page (with sidebar and navbar)
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-h-screen">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
              <div className="space-y-6">
                {/* Profile Header Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      {/* Avatar */}
                      {profile.userImage ? (
                        <img
                          src={profile.userImage}
                          alt={profile.username || 'Profile'}
                          className="inline-block w-20 h-20 rounded-full object-cover border-4 border-primary-500 shadow-lg mb-3"
                        />
                      ) : (
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-2xl font-bold mb-3 shadow-lg">
                          {getUserInitial()}
                        </div>
                      )}

                      {/* Username */}
                      <h2 className="text-2xl font-bold text-text mb-2">
                        @{profile.username}
                      </h2>

                      {/* Join Date */}
                      <div className="flex items-center justify-center gap-2 text-text-muted mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {getJoinDate()}</span>
                      </div>

                      {/* Location & Website */}
                      <div className="flex items-center justify-center gap-6 text-text-muted mb-4">
                        {profile.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                        {profile.websiteUrl && (
                          <a
                            href={profile.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-primary-500 transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span>Website</span>
                          </a>
                        )}
                      </div>

                      {/* Bio */}
                      {profile.bio && (
                        <p className="text-text max-w-2xl mx-auto mb-4">
                          {profile.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      {profile.socialLinks &&
                        profile.socialLinks.length > 0 && (
                          <div className="flex items-center justify-center gap-3">
                            {profile.socialLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:bg-background transition-colors text-text-muted hover:text-primary-500"
                              >
                                {getSocialIcon(link)}
                              </a>
                            ))}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>

                {renderPortfolioContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If user is not authenticated, render as a public standalone page
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-background rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-text" />
            </button>
            <Link href="/">
              <span className="text-xl font-bold text-primary-500">
                SkillSync
              </span>
            </Link>
          </div>

          <div>
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          {/* Avatar */}
          {profile.userImage ? (
            <img
              src={profile.userImage}
              alt={profile.username || 'Profile'}
              className="inline-block w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-lg mb-4"
            />
          ) : (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl font-bold mb-4 shadow-lg">
              {getUserInitial()}
            </div>
          )}

          {/* Username */}
          <h1 className="text-4xl font-bold text-text mb-2">
            {profile.username}
          </h1>

          {/* Join Date */}
          <div className="flex items-center justify-center gap-2 text-text-muted mb-4">
            <Calendar className="w-4 h-4" />
            <span>Joined {getJoinDate()}</span>
          </div>

          {/* Location & Website */}
          <div className="flex items-center justify-center gap-6 text-text-muted mb-6">
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-500 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-text max-w-2xl mx-auto mb-6">{profile.bio}</p>
          )}

          {/* Social Links */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              {profile.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-surface transition-colors text-text-muted hover:text-primary-500"
                  title={link}
                >
                  {getSocialIcon(link)}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Content Sections */}
        <div className="space-y-12">{renderPortfolioContent()}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-text-muted text-sm">
          <p>
            Powered by{" "}
            <span className="text-primary-500 font-semibold">SkillSync</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
