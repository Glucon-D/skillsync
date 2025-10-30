/**
 * @file (dashboard)/pathways/[pathwayId]/page.tsx
 * @description Individual pathway detail page with roadmap, steps, and resources
 * @dependencies react, lucide-react, next/navigation, @/store/authStore, @/lib/db
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Save,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GeneratedPathwayResponse } from "@/lib/types";
import { aiPathwaysService, type AIPathwayRow } from "@/lib/db";

export default function PathwayDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const pathwayId = params.pathwayId as string;

  const [pathway, setPathway] = useState<GeneratedPathwayResponse | null>(null);
  const [pathwayRow, setPathwayRow] = useState<AIPathwayRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    loadPathway();
  }, [pathwayId, user?.id]);

  const loadPathway = async () => {
    if (!user?.id || !pathwayId) {
      setError("Missing required data");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the pathway data
      const pathwayData = await aiPathwaysService.getAIPathwayById(user.id, pathwayId);

      if (!pathwayData) {
        setError("Pathway not found");
        setIsLoading(false);
        return;
      }

      // Get the pathway row for additional metadata
      const pathways = await aiPathwaysService.getAIPathways(user.id);
      const row = pathways.find((p) => p.pathwayId === pathwayId);

      setPathway(pathwayData);
      setPathwayRow(row || null);
    } catch (err) {
      console.error("Error loading pathway:", err);
      setError("Failed to load pathway");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  const handleToggleCompletion = async (completed: boolean) => {
    if (!pathwayRow?.$id) return;

    try {
      await aiPathwaysService.updateCompletion(pathwayRow.$id, completed);
      // Reload pathway to get updated data
      await loadPathway();
    } catch (err) {
      setError("Failed to update completion status");
    }
  };

  const handleDeletePathway = async () => {
    if (!pathwayRow?.$id) return;
    if (!confirm("Are you sure you want to delete this pathway?")) return;

    try {
      await aiPathwaysService.delete(pathwayRow.$id);
      router.push("/pathways");
    } catch (err) {
      setError("Failed to delete pathway");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto">
        <Card className="border-red-500/20">
          <CardContent className="py-16 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text mb-3">
              {error || "Pathway not found"}
            </h3>
            <Button onClick={() => router.push("/pathways")} variant="outline">
              ← Back to Pathways
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => router.push("/pathways")}
          variant="outline"
          size="sm"
        >
          ← Back to Pathways
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDeletePathway}
            variant="outline"
            size="sm"
            className="text-red-500 border-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Pathway Header */}
      <Card className="border-primary-500/20 bg-gradient-to-br from-primary-500/5 to-primary-600/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="bg-primary-500">
                  {pathway.estimatedDuration}
                </Badge>
                {pathwayRow?.isCustom && (
                  <Badge variant="default" className="bg-purple-500">
                    Custom Skill
                  </Badge>
                )}
                {pathwayRow?.completed && (
                  <Badge variant="default" className="bg-green-500">
                    ✓ Completed
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-text mb-3">
                {pathway.pathway_title}
              </h1>
              <p className="text-text-muted text-lg">{pathway.description}</p>
            </div>

            {/* Mark as Complete Checkbox */}
            {pathwayRow && (
              <div className="flex items-start gap-2 bg-surface/80 rounded-lg px-4 py-3 border border-border">
                <input
                  type="checkbox"
                  id="pathway-complete"
                  checked={pathwayRow.completed || false}
                  onChange={(e) => handleToggleCompletion(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-border text-primary-500 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                />
                <label
                  htmlFor="pathway-complete"
                  className="text-sm text-text font-medium cursor-pointer select-none"
                >
                  Mark as
                  <br />
                  Completed
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Steps */}
      <div>
        <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-500" />
          Learning Roadmap
        </h2>
        <div className="space-y-4">
          {pathway.steps.map((step, index) => (
            <Card key={index} className="border-border hover:border-primary-500/50 transition-all duration-200">
              <CardHeader className="pb-3">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleStep(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text">
                        {step.stage}
                      </h3>
                      <p className="text-sm text-text-muted flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {step.duration}
                      </p>
                    </div>
                  </div>
                  {expandedSteps.has(index) ? (
                    <ChevronUp className="w-6 h-6 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-text-muted" />
                  )}
                </div>
              </CardHeader>
              {expandedSteps.has(index) && (
                <CardContent className="space-y-4 pt-0">
                  <p className="text-text-muted">{step.description}</p>

                  <div>
                    <p className="text-sm font-semibold text-text mb-2">
                      Skills to Learn:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.skills.map((skill, idx) => (
                        <Badge key={idx} variant="default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-text mb-2">
                      Key Milestones:
                    </p>
                    <ul className="space-y-2">
                      {step.milestones.map((milestone, idx) => (
                        <li
                          key={idx}
                          className="text-text-muted flex items-start gap-2"
                        >
                          <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Resources */}
      {pathway.resources && pathway.resources.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-text mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-500" />
            Recommended Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathway.resources.map((resource, index) => (
              <Card
                key={index}
                className="border-border hover:border-primary-500/50 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <Badge variant="default" size="sm" className="mb-2">
                        {resource.type}
                      </Badge>
                      <h4 className="font-semibold text-text mb-2">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-text-muted">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 mt-3 font-medium"
                    >
                      View Resource
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
