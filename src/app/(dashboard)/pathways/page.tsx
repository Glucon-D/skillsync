/**
 * @file (dashboard)/pathways/page.tsx
 * @description Enhanced skill pathways page with AI-powered career recommendations
 * @dependencies react, lucide-react, @/store/pathwaysStore, @/store/authStore, @/store/profileStore, @/data/skills, @/components/ui, @/lib/types
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  AlertCircle,
  Loader2,
  Pencil,
  Zap,
  Trash2,
  Plus,
  CheckSquare,
  Square,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type {
  PathwayRecommendationsResponse,
  GeneratedPathwayResponse,
} from "@/lib/types";
import { aiPathwaysService, type AIPathwayRow } from "@/lib/db";

export default function PathwaysPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { profile } = useProfileStore();

  // AI Pathways State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isRecommendationsModalOpen, setIsRecommendationsModalOpen] =
    useState(false);
  const [aiRecommendations, setAiRecommendations] =
    useState<PathwayRecommendationsResponse | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Skill State
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Saved Pathways State
  const [savedPathways, setSavedPathways] = useState<AIPathwayRow[]>([]);
  const [pathwayFilter, setPathwayFilter] = useState<"active" | "completed">(
    "active"
  ); // Tab state

  useEffect(() => {
    if (user?.id) {
      loadSavedPathways();
    }
  }, [user?.id]);

  // Load saved AI pathways from database
  const loadSavedPathways = async () => {
    if (!user?.id) return;

    try {
      const pathways = await aiPathwaysService.getAIPathways(user.id);
      setSavedPathways(pathways);
    } catch (error) {
      console.error("Error loading saved pathways:", error);
    }
  };

  // Get AI Career Recommendations
  const handleGetRecommendations = async () => {
    if (!profile) {
      setError(
        "Please complete your profile first to get personalized recommendations"
      );
      return;
    }

    setIsLoadingRecommendations(true);
    setError(null);
    setAiRecommendations(null);
    setIsRecommendationsModalOpen(true);

    try {
      const response = await fetch("/api/recommend-pathways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get recommendations");
      }

      const result = await response.json();
      setAiRecommendations(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Generate Detailed Roadmap
  const handleGenerateRoadmap = async (
    pathwayTitle: string,
    isCustom: boolean = false
  ) => {
    if (!profile) {
      setError("Profile not found");
      return;
    }

    setIsLoadingRoadmap(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-pathway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, pathwayTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate roadmap");
      }

      const result = await response.json();
      const pathwayData = result.data;

      // Auto-save to database
      if (user?.id) {
        try {
          const savedPathway = await aiPathwaysService.saveAIPathway(
            user.id,
            pathwayData,
            isCustom
          );
          await loadSavedPathways(); // Refresh saved pathways list

          // Close modals and navigate to the new pathway page
          setIsRecommendationsModalOpen(false);
          setIsGenerateModalOpen(false);
          router.push(`/pathways/${savedPathway.pathwayId}`);
        } catch (saveError) {
          console.error("Error saving pathway:", saveError);
          setError("Failed to save pathway");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  // Generate Custom Skill Pathway
  const handleGenerateCustomPathway = async () => {
    if (!customSkill.trim()) {
      setError("Please enter a skill or career path");
      return;
    }

    if (!profile) {
      setError("Please complete your profile first");
      return;
    }

    // Use the roadmap generation directly, mark as custom
    await handleGenerateRoadmap(customSkill.trim(), true);
    setCustomSkill("");
    setShowCustomInput(false);
  };

  // Load a saved pathway
  const handleLoadSavedPathway = (pathwayId: string) => {
    router.push(`/pathways/${pathwayId}`);
  };

  // Toggle pathway completion
  const handleToggleCompletion = async (
    rowId: string,
    currentCompleted: boolean
  ) => {
    try {
      await aiPathwaysService.updateCompletion(rowId, !currentCompleted);
      await loadSavedPathways(); // Refresh list
    } catch (err) {
      setError("Failed to update completion status");
    }
  };

  // Delete a saved pathway
  const handleDeletePathway = async (rowId: string) => {
    if (!confirm("Are you sure you want to delete this pathway?")) return;

    try {
      await aiPathwaysService.delete(rowId);
      await loadSavedPathways();
    } catch (err) {
      setError("Failed to delete pathway");
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
            Career Pathways
          </h1>
          <p className="text-text-muted text-lg">
            AI-powered career recommendations and learning paths
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            Generate Pathway
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs for Active/Completed Pathways */}
      {savedPathways.length > 0 && (
        <div className="flex gap-2 border-b-2 border-border pb-1">
          <div className="flex gap-2 bg-surface rounded-full p-1 border border-border shadow-sm">
            <button
              onClick={() => setPathwayFilter("active")}
              className={`px-6 py-2.5 font-semibold rounded-full transition-all duration-200 ${
                pathwayFilter === "active"
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                  : "text-text-muted hover:text-text hover:bg-background"
              }`}
            >
              Your Pathways (
              {savedPathways.filter((p: any) => !p.completed).length})
            </button>
            <button
              onClick={() => setPathwayFilter("completed")}
              className={`px-6 py-2.5 font-semibold rounded-full transition-all duration-200 ${
                pathwayFilter === "completed"
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                  : "text-text-muted hover:text-text hover:bg-background"
              }`}
            >
              Completed ({savedPathways.filter((p: any) => p.completed).length})
            </button>
          </div>
        </div>
      )}

      {/* Show Existing Pathways */}
      {savedPathways.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPathways
            .filter((pathway: any) =>
              pathwayFilter === "active"
                ? !pathway.completed
                : pathway.completed
            )
            .map((pathway: any) => (
              <Card
                key={pathway.$id}
                className="border-border hover:border-primary-500/50 transition-all duration-200 hover:shadow-lg"
              >
                <CardContent className="">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-text">
                          {pathway.name}
                        </h4>
                        {pathway.completed && (
                          <Badge
                            variant="default"
                            className="bg-green-500 text-xs"
                          >
                            ✓
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" size="sm">
                          {pathway.category}
                        </Badge>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {pathway.estimatedTime}
                        </span>
                      </div>
                      {pathway.description && (
                        <p className="text-sm text-text-muted line-clamp-2">
                          {pathway.description}
                        </p>
                      )}
                    </div>

                    {/* Complete Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCompletion(pathway.$id, pathway.completed);
                      }}
                      className={`p-2 rounded-lg transition-all ${
                        pathway.completed
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-surface hover:bg-background text-text-muted border border-border"
                      }`}
                      title={
                        pathway.completed
                          ? "Mark as incomplete"
                          : "Mark as complete"
                      }
                    >
                      {pathway.completed ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleLoadSavedPathway(pathway.pathwayId)}
                      className="flex-1 bg-primary-500 hover:bg-primary-600"
                      size="sm"
                    >
                      View Roadmap
                    </Button>
                    <Button
                      onClick={() => handleDeletePathway(pathway.$id)}
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Empty State - No Pathways */}
      {savedPathways.length === 0 && (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
              <Target className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">
              No Pathways Yet
            </h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Generate your first AI-powered career pathway to start your
              learning journey
            </p>
            <Button
              onClick={() => setIsGenerateModalOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Your First Pathway
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State for Active/Completed Tabs */}
      {savedPathways.length > 0 &&
        savedPathways.filter((pathway: any) =>
          pathwayFilter === "active" ? !pathway.completed : pathway.completed
        ).length === 0 && (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="py-12 text-center">
              <p className="text-text-muted">
                No {pathwayFilter === "active" ? "active" : "completed"}{" "}
                pathways yet
              </p>
            </CardContent>
          </Card>
        )}

      {/* Recommendations Modal */}
      <Modal
        isOpen={isRecommendationsModalOpen}
        onClose={() => {
          setIsRecommendationsModalOpen(false);
          setAiRecommendations(null);
          setError(null);
          setCustomSkill("");
          setShowCustomInput(false);
        }}
        title={
          aiRecommendations
            ? "Recommended Career Pathways"
            : "Generating Recommendations"
        }
      >
        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingRecommendations && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-text mb-2">
                Analyzing Your Profile...
              </h3>
              <p className="text-text-muted">This may take a few moments</p>
            </div>
          )}

          {/* Show Recommendations */}
          {!isLoadingRecommendations && aiRecommendations && (
            <div className="space-y-4">
              {/* Actions Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  variant="outline"
                  size="sm"
                  className="border-primary-500 text-primary-500"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Custom Skill
                </Button>
                <Button
                  onClick={() => {
                    setAiRecommendations(null);
                    setError(null);
                    handleGetRecommendations();
                  }}
                  variant="outline"
                  size="sm"
                >
                  Get New Recommendations
                </Button>
              </div>

              {/* Custom Skill Input */}
              {showCustomInput && (
                <div className="p-4 bg-surface/50 rounded-xl border border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !isLoadingRoadmap &&
                          customSkill.trim()
                        ) {
                          handleGenerateCustomPathway();
                        }
                      }}
                      placeholder="Enter any skill or technology..."
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={isLoadingRoadmap}
                    />
                    <Button
                      onClick={handleGenerateCustomPathway}
                      disabled={isLoadingRoadmap || !customSkill.trim()}
                      className="bg-primary-500 hover:bg-primary-600"
                    >
                      {isLoadingRoadmap ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Generate</>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Recommendations List */}
              <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto">
                {aiRecommendations.recommendations.map((rec, index) => (
                  <Card
                    key={index}
                    className="border-border hover:border-primary-500/50 transition-all duration-200"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary-500" />
                        {rec.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-text mb-2">
                          Why This Pathway:
                        </p>
                        <p className="text-sm text-text-muted">
                          {rec.reasoning}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text mb-2">
                          What You'll Do:
                        </p>
                        <p className="text-sm text-text-muted">{rec.summary}</p>
                      </div>
                      <Button
                        onClick={() => handleGenerateRoadmap(rec.title)}
                        disabled={isLoadingRoadmap}
                        className="w-full"
                      >
                        {isLoadingRoadmap ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Roadmap...
                          </>
                        ) : (
                          <>
                            Generate Detailed Roadmap
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Generate Pathway Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false);
          setError(null);
          setCustomSkill("");
          setShowCustomInput(false);
        }}
        title="Generate AI Career Pathway"
      >
        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          <div className="text-center">
            <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-text mb-2">
              Discover Your Ideal Career Path
            </h3>
            <p className="text-text-muted mb-6">
              Our AI analyzes your profile, skills, education, and interests to
              recommend personalized career pathways perfectly suited to your
              strengths and goals.
            </p>
          </div>

          {/* Main Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                handleGetRecommendations();
                setIsGenerateModalOpen(false);
              }}
              disabled={isLoadingRecommendations || !profile}
              size="lg"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
            >
              {isLoadingRecommendations ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Your Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get AI Career Recommendations
                </>
              )}
            </Button>

            <Button
              onClick={() => setShowCustomInput(!showCustomInput)}
              disabled={!profile}
              variant="outline"
              className="w-full border-primary-500 text-primary-500 hover:bg-primary-500/10"
            >
              <Pencil className="w-5 h-5 mr-2" />
              Learn Custom Skill
            </Button>
          </div>

          {/* Custom Skill Input */}
          {showCustomInput && (
            <div className="p-4 bg-surface/50 rounded-xl border border-border">
              <div className="flex items-start gap-3 mb-4">
                <Zap className="w-5 h-5 text-primary-500 mt-1 shrink-0" />
                <div className="text-left flex-1">
                  <h4 className="font-semibold text-text mb-1">
                    Learn Any Skill
                  </h4>
                  <p className="text-sm text-text-muted">
                    Enter any skill, technology, or career path you want to
                    learn, and AI will generate a personalized roadmap.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !isLoadingRoadmap &&
                      customSkill.trim()
                    ) {
                      handleGenerateCustomPathway();
                      setIsGenerateModalOpen(false);
                    }
                  }}
                  placeholder="e.g., Machine Learning, React.js, Data Science..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isLoadingRoadmap}
                />

                <Button
                  onClick={() => {
                    handleGenerateCustomPathway();
                    setIsGenerateModalOpen(false);
                  }}
                  disabled={isLoadingRoadmap || !customSkill.trim()}
                  className="w-full bg-primary-500 hover:bg-primary-600"
                >
                  {isLoadingRoadmap ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Pathway
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Example suggestions */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-text-muted mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Python Programming",
                    "Web Development",
                    "AI & Machine Learning",
                    "Cloud Computing",
                    "Mobile App Development",
                    "Cybersecurity",
                  ].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setCustomSkill(skill)}
                      className="px-2 py-1 text-xs rounded-md bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 transition-colors"
                      disabled={isLoadingRoadmap}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!profile && (
            <p className="text-sm text-text-muted text-center">
              Please complete your profile first
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
