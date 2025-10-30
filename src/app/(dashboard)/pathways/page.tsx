/**
 * @file (dashboard)/pathways/page.tsx
 * @description Enhanced skill pathways page with AI-powered career recommendations
 * @dependencies react, lucide-react, @/store/pathwaysStore, @/store/authStore, @/store/profileStore, @/data/skills, @/components/ui, @/lib/types
 */

'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Sparkles, ArrowRight, BookOpen, Target, AlertCircle, Loader2, ChevronDown, ChevronUp, Pencil, Zap, Save, History, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PathwayRecommendationsResponse, GeneratedPathwayResponse } from '@/lib/types';
import { aiPathwaysService, type AIPathwayRow } from '@/lib/db';

export default function PathwaysPage() {
  const user = useAuthStore((state) => state.user);
  const { profile } = useProfileStore();

  // AI Pathways State
  const [showAISection, setShowAISection] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<PathwayRecommendationsResponse | null>(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState<GeneratedPathwayResponse | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  // Custom Skill State
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Saved Pathways State
  const [savedPathways, setSavedPathways] = useState<AIPathwayRow[]>([]);
  const [showSavedPathways, setShowSavedPathways] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPathwayId, setCurrentPathwayId] = useState<string | null>(null);
  const [currentPathwayRowId, setCurrentPathwayRowId] = useState<string | null>(null);
  const [isCustomPathway, setIsCustomPathway] = useState(false);
  const [pathwayFilter, setPathwayFilter] = useState<'active' | 'completed'>('active'); // Tab state

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
      console.error('Error loading saved pathways:', error);
    }
  };

  // Get AI Career Recommendations
  const handleGetRecommendations = async () => {
    if (!profile) {
      setError('Please complete your profile first to get personalized recommendations');
      return;
    }

    setIsLoadingRecommendations(true);
    setError(null);
    setAiRecommendations(null);
    setSelectedRoadmap(null);

    try {
      const response = await fetch('/api/recommend-pathways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendations');
      }

      const result = await response.json();
      setAiRecommendations(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Generate Detailed Roadmap
  const handleGenerateRoadmap = async (pathwayTitle: string, isCustom: boolean = false) => {
    if (!profile) {
      setError('Profile not found');
      return;
    }

    setIsLoadingRoadmap(true);
    setError(null);
    setSelectedRoadmap(null);
    setExpandedSteps(new Set([0]));
    setIsCustomPathway(isCustom);

    try {
      const response = await fetch('/api/generate-pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, pathwayTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate roadmap');
      }

      const result = await response.json();
      const pathwayData = result.data;
      setSelectedRoadmap(pathwayData);
      setShowAISection(true);

      // Auto-save to database
      if (user?.id) {
        try {
          const savedPathway = await aiPathwaysService.saveAIPathway(
            user.id,
            pathwayData,
            isCustom
          );
          setCurrentPathwayId(savedPathway.pathwayId);
          await loadSavedPathways(); // Refresh saved pathways list
        } catch (saveError) {
          console.error('Error saving pathway:', saveError);
          // Don't block UI if save fails, just log it
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingRoadmap(false);
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

  // Generate Custom Skill Pathway
  const handleGenerateCustomPathway = async () => {
    if (!customSkill.trim()) {
      setError('Please enter a skill or career path');
      return;
    }

    if (!profile) {
      setError('Please complete your profile first');
      return;
    }

    // Use the roadmap generation directly, mark as custom
    await handleGenerateRoadmap(customSkill.trim(), true);
    setCustomSkill('');
    setShowCustomInput(false);
  };

  // Load a saved pathway
  const handleLoadSavedPathway = async (pathwayId: string, rowId: string) => {
    if (!user?.id) return;

    try {
      setIsLoadingRoadmap(true);
      const pathwayData = await aiPathwaysService.getAIPathwayById(user.id, pathwayId);

      if (pathwayData) {
        setSelectedRoadmap(pathwayData);
        setCurrentPathwayId(pathwayId);
        setCurrentPathwayRowId(rowId);
        setShowSavedPathways(false);
        setExpandedSteps(new Set([0]));
      } else {
        setError('Pathway not found');
      }
    } catch (err) {
      setError('Failed to load pathway');
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  // Toggle pathway completion
  const handleToggleCompletion = async (completed: boolean) => {
    if (!currentPathwayRowId) return;

    try {
      await aiPathwaysService.updateCompletion(currentPathwayRowId, completed);
      await loadSavedPathways(); // Refresh list
    } catch (err) {
      setError('Failed to update completion status');
    }
  };

  // Delete a saved pathway
  const handleDeletePathway = async (pathwayId: string, rowId: string) => {
    if (!confirm('Are you sure you want to delete this pathway?')) return;

    try {
      await aiPathwaysService.delete(rowId);
      await loadSavedPathways();

      // If currently viewing this pathway, clear it
      if (currentPathwayId === pathwayId) {
        setSelectedRoadmap(null);
        setCurrentPathwayId(null);
        setCurrentPathwayRowId(null);
      }
    } catch (err) {
      setError('Failed to delete pathway');
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Career Pathways</h1>
          <p className="text-text-muted">AI-powered career recommendations and learning paths</p>
        </div>
        {savedPathways.length > 0 && (
          <Button
            onClick={() => setShowSavedPathways(!showSavedPathways)}
            variant="outline"
            className="border-primary-500 text-primary-500"
          >
            <History className="w-4 h-4 mr-2" />
            Saved Pathways ({savedPathways.length})
          </Button>
        )}
      </div>

      {/* Saved Pathways Section */}
      {showSavedPathways && savedPathways.length > 0 && (
        <Card className="border-primary-500/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary-500" />
                <CardTitle>Your Saved Pathways</CardTitle>
              </div>
              <Button
                onClick={() => setShowSavedPathways(false)}
                variant="ghost"
                size="sm"
              >
                Close
              </Button>
            </div>

            {/* Tabs for Active/Completed */}
            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setPathwayFilter('active')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  pathwayFilter === 'active'
                    ? 'text-primary-500'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Your Pathways
                {pathwayFilter === 'active' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
                )}
              </button>
              <button
                onClick={() => setPathwayFilter('completed')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  pathwayFilter === 'completed'
                    ? 'text-primary-500'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Completed Pathways
                {pathwayFilter === 'completed' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
                )}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPathways
                .filter((pathway: any) =>
                  pathwayFilter === 'active' ? !pathway.completed : pathway.completed
                )
                .map((pathway: any) => (
                  <Card key={pathway.$id} className="border-border hover:border-primary-500/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-text">{pathway.name}</h4>
                            {pathway.completed && (
                              <Badge variant="default" className="bg-green-500 text-xs">
                                ✓ Completed
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
                            <p className="text-sm text-text-muted line-clamp-2">{pathway.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleLoadSavedPathway(pathway.pathwayId, pathway.$id)}
                          className="flex-1 bg-primary-500 hover:bg-primary-600"
                          size="sm"
                        >
                          View Roadmap
                        </Button>
                        <Button
                          onClick={() => handleDeletePathway(pathway.pathwayId, pathway.$id)}
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

            {/* Empty State */}
            {savedPathways.filter((pathway: any) =>
              pathwayFilter === 'active' ? !pathway.completed : pathway.completed
            ).length === 0 && (
              <div className="text-center py-8 text-text-muted">
                <p>No {pathwayFilter === 'active' ? 'active' : 'completed'} pathways yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI-Powered Career Recommendations Section */}
      <Card className="border-primary-500/20 bg-gradient-to-br from-primary-500/5 to-primary-600/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Career Pathways</CardTitle>
                <p className="text-sm text-text-muted">Get personalized career recommendations powered by AI</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}

          {!aiRecommendations && !selectedRoadmap && (
            <div className="text-center py-8">
              <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-text mb-2">Discover Your Ideal Career Path</h3>
              <p className="text-text-muted mb-6 max-w-2xl mx-auto">
                Our AI analyzes your profile, skills, education, and interests to recommend 3-4 personalized career pathways perfectly suited to your strengths and goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
                <Button
                  onClick={handleGetRecommendations}
                  disabled={isLoadingRecommendations || !profile}
                  size="lg"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25"
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
                  size="lg"
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-500/10"
                >
                  <Pencil className="w-5 h-5 mr-2" />
                  Learn Custom Skill
                </Button>
              </div>

              {/* Custom Skill Input */}
              {showCustomInput && (
                <div className="max-w-xl mx-auto mt-6 p-6 bg-surface/50 rounded-xl border border-border">
                  <div className="flex items-start gap-3 mb-4">
                    <Zap className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <h4 className="font-semibold text-text mb-1">Learn Any Skill</h4>
                      <p className="text-sm text-text-muted">
                        Enter any skill, technology, or career path you want to learn, and AI will generate a personalized roadmap based on your current profile.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoadingRoadmap) {
                          handleGenerateCustomPathway();
                        }
                      }}
                      placeholder="e.g., Machine Learning, React.js, Data Science, DevOps..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={isLoadingRoadmap}
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={handleGenerateCustomPathway}
                        disabled={isLoadingRoadmap || !customSkill.trim()}
                        className="flex-1 bg-primary-500 hover:bg-primary-600"
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
                      <Button
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomSkill('');
                        }}
                        variant="outline"
                        disabled={isLoadingRoadmap}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* Example suggestions */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-text-muted mb-2">Popular skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Python Programming', 'Web Development', 'AI & Machine Learning', 'Cloud Computing', 'Mobile App Development', 'Cybersecurity'].map((skill) => (
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
                <p className="text-sm text-text-muted mt-3">
                  Please complete your profile first
                </p>
              )}
            </div>
          )}

          {/* Show Recommendations */}
          {aiRecommendations && !selectedRoadmap && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-text">Recommended Career Pathways</h3>
                <div className="flex gap-2">
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
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Get New Recommendations
                  </Button>
                </div>
              </div>

              {/* Custom Skill Input in Recommendations View */}
              {showCustomInput && (
                <div className="p-4 bg-surface/50 rounded-xl border border-border mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoadingRoadmap) {
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
                    <Button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomSkill('');
                      }}
                      variant="outline"
                      disabled={isLoadingRoadmap}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {aiRecommendations.recommendations.map((rec, index) => (
                  <Card key={index} className="border-border hover:border-primary-500/50 transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary-500" />
                            {rec.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-text mb-2">Why This Pathway:</p>
                        <p className="text-sm text-text-muted">{rec.reasoning}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text mb-2">What You'll Do:</p>
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

          {/* Show Detailed Roadmap */}
          {selectedRoadmap && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedRoadmap(null)}
                  variant="outline"
                  size="sm"
                >
                  ← Back to Recommendations
                </Button>
                <div className="flex items-center gap-2">
                  {currentPathwayId && (
                    <Badge variant="default" className="bg-green-500">
                      <Save className="w-3 h-3 mr-1" />
                      Saved
                    </Badge>
                  )}
                  <Badge variant="default" className="bg-primary-500">
                    {selectedRoadmap.estimatedDuration}
                  </Badge>
                  {isCustomPathway && (
                    <Badge variant="default" className="bg-purple-500">
                      Custom Skill
                    </Badge>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-xl p-6 border border-primary-500/20">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-text mb-3">{selectedRoadmap.pathway_title}</h2>
                    <p className="text-text-muted">{selectedRoadmap.description}</p>
                  </div>

                  {/* Mark as Complete Checkbox */}
                  {currentPathwayRowId && (
                    <div className="flex items-start gap-2 bg-surface/80 rounded-lg px-4 py-3 border border-border">
                      <input
                        type="checkbox"
                        id="pathway-complete"
                        checked={savedPathways.find((p: any) => p.$id === currentPathwayRowId)?.completed || false}
                        onChange={(e) => handleToggleCompletion(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-border text-primary-500 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                      />
                      <label htmlFor="pathway-complete" className="text-sm text-text font-medium cursor-pointer select-none">
                        Mark as<br />Completed
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Steps */}
              <div>
                <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  Learning Roadmap
                </h3>
                <div className="space-y-3">
                  {selectedRoadmap.steps.map((step, index) => (
                    <Card key={index} className="border-border">
                      <CardHeader className="pb-3">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleStep(index)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-text">{step.stage}</h4>
                              <p className="text-sm text-text-muted flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {step.duration}
                              </p>
                            </div>
                          </div>
                          {expandedSteps.has(index) ? (
                            <ChevronUp className="w-5 h-5 text-text-muted" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-text-muted" />
                          )}
                        </div>
                      </CardHeader>
                      {expandedSteps.has(index) && (
                        <CardContent className="space-y-4 pt-0">
                          <p className="text-sm text-text-muted">{step.description}</p>

                          <div>
                            <p className="text-sm font-semibold text-text mb-2">Skills to Learn:</p>
                            <div className="flex flex-wrap gap-2">
                              {step.skills.map((skill, idx) => (
                                <Badge key={idx} variant="default">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-text mb-2">Key Milestones:</p>
                            <ul className="space-y-1">
                              {step.milestones.map((milestone, idx) => (
                                <li key={idx} className="text-sm text-text-muted flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
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
              {selectedRoadmap.resources && selectedRoadmap.resources.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-text mb-4">Recommended Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRoadmap.resources.map((resource, index) => (
                      <Card key={index} className="border-border hover:border-primary-500/50 transition-colors">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <Badge variant="default" size="sm" className="mb-2">
                                {resource.type}
                              </Badge>
                              <h4 className="font-semibold text-text mb-1">{resource.title}</h4>
                              <p className="text-sm text-text-muted">{resource.description}</p>
                            </div>
                          </div>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 mt-3"
                            >
                              View Resource
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
