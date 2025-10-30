/**
 * @file api-examples.ts
 * @description Example usage of AI Career Pathway APIs
 * @dependencies @/lib/types
 */

import type {
  Profile,
  PathwayRecommendationsResponse,
  GeneratedPathwayResponse,
} from './types';

/**
 * Example 1: Get career pathway recommendations
 *
 * This function calls the /api/recommend-pathways endpoint to get 3-4
 * AI-generated career pathway recommendations based on the user's profile.
 */
export async function getCareerRecommendations(
  profile: Profile
): Promise<PathwayRecommendationsResponse> {
  const response = await fetch('/api/recommend-pathways', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get career recommendations');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Example 2: Generate a detailed pathway roadmap
 *
 * This function calls the /api/generate-pathway endpoint to generate
 * a detailed, step-by-step roadmap for a specific career pathway.
 */
export async function generatePathwayRoadmap(
  profile: Profile,
  pathwayTitle: string
): Promise<GeneratedPathwayResponse> {
  const response = await fetch('/api/generate-pathway', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profile,
      pathwayTitle,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate pathway roadmap');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Example 3: Complete workflow - Get recommendations then generate roadmap
 *
 * This example shows how to first get recommendations, let the user choose one,
 * and then generate a detailed roadmap for that chosen pathway.
 */
export async function completeCareerPlanningWorkflow(
  profile: Profile,
  onRecommendationsReceived?: (recommendations: PathwayRecommendationsResponse) => void,
  onRoadmapGenerated?: (roadmap: GeneratedPathwayResponse) => void
): Promise<{
  recommendations: PathwayRecommendationsResponse;
  selectedRoadmap?: GeneratedPathwayResponse;
}> {
  try {
    // Step 1: Get career recommendations
    console.log('Getting career recommendations...');
    const recommendations = await getCareerRecommendations(profile);
    console.log('Received recommendations:', recommendations);

    if (onRecommendationsReceived) {
      onRecommendationsReceived(recommendations);
    }

    // In a real app, you would let the user select a pathway here
    // For this example, we'll use the first recommendation
    if (recommendations.recommendations.length > 0) {
      const selectedPathway = recommendations.recommendations[0];
      console.log('Selected pathway:', selectedPathway.title);

      // Step 2: Generate detailed roadmap for the selected pathway
      console.log('Generating detailed roadmap...');
      const roadmap = await generatePathwayRoadmap(profile, selectedPathway.title);
      console.log('Received roadmap:', roadmap);

      if (onRoadmapGenerated) {
        onRoadmapGenerated(roadmap);
      }

      return {
        recommendations,
        selectedRoadmap: roadmap,
      };
    }

    return { recommendations };
  } catch (error) {
    console.error('Error in career planning workflow:', error);
    throw error;
  }
}

/**
 * Example 4: Usage in a React component
 *
 * Here's how you might use these functions in a React component:
 */
/*
'use client';

import { useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { getCareerRecommendations, generatePathwayRoadmap } from '@/lib/api-examples';
import type { PathwayRecommendationsResponse, GeneratedPathwayResponse } from '@/lib/types';

export default function CareerPlanningPage() {
  const { profile } = useProfileStore();
  const [recommendations, setRecommendations] = useState<PathwayRecommendationsResponse | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<GeneratedPathwayResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (!profile) {
      setError('Please complete your profile first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCareerRecommendations(profile);
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async (pathwayTitle: string) => {
    if (!profile) {
      setError('Please complete your profile first');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedPathway(pathwayTitle);

    try {
      const data = await generatePathwayRoadmap(profile, pathwayTitle);
      setRoadmap(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">AI Career Planning</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!recommendations && (
        <button
          onClick={handleGetRecommendations}
          disabled={loading}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Career Recommendations'}
        </button>
      )}

      {recommendations && !roadmap && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recommended Career Pathways</h2>
          {recommendations.recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="text-xl font-bold">{rec.title}</h3>
              <p className="text-text-muted mt-2">{rec.reasoning}</p>
              <p className="mt-2">{rec.summary}</p>
              <button
                onClick={() => handleGenerateRoadmap(rec.title)}
                disabled={loading}
                className="mt-4 bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
              >
                Generate Detailed Roadmap
              </button>
            </div>
          ))}
        </div>
      )}

      {roadmap && (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => {
                setRoadmap(null);
                setSelectedPathway(null);
              }}
              className="text-primary-500 hover:text-primary-600 mb-4"
            >
              ← Back to Recommendations
            </button>
            <h2 className="text-2xl font-semibold">{roadmap.pathway_title}</h2>
            <p className="text-text-muted mt-2">{roadmap.description}</p>
            <p className="text-sm text-text-muted mt-2">
              Estimated Duration: {roadmap.estimatedDuration}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Learning Pathway</h3>
            {roadmap.steps.map((step, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <h4 className="text-lg font-bold">
                  {step.stage} ({step.duration})
                </h4>
                <p className="text-text-muted mt-2">{step.description}</p>
                <div className="mt-3">
                  <h5 className="font-semibold">Skills to Learn:</h5>
                  <ul className="list-disc list-inside">
                    {step.skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <h5 className="font-semibold">Milestones:</h5>
                  <ul className="list-disc list-inside">
                    {step.milestones.map((milestone, i) => (
                      <li key={i}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {roadmap.resources && roadmap.resources.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Recommended Resources</h3>
              {roadmap.resources.map((resource, index) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{resource.title}</h4>
                      <span className="text-xs text-text-muted uppercase">{resource.type}</span>
                      <p className="text-sm mt-2">{resource.description}</p>
                    </div>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 text-sm"
                      >
                        View →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
*/

/**
 * Example 5: Error handling
 */
export async function getRecommendationsWithRetry(
  profile: Profile,
  maxRetries: number = 3
): Promise<PathwayRecommendationsResponse> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getCareerRecommendations(profile);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Failed to get recommendations after retries');
}

/**
 * Example 6: Using with Zustand store
 */
/*
import { create } from 'zustand';
import type { PathwayRecommendationsResponse, GeneratedPathwayResponse } from '@/lib/types';

interface CareerPlanningState {
  recommendations: PathwayRecommendationsResponse | null;
  roadmap: GeneratedPathwayResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface CareerPlanningActions {
  fetchRecommendations: (profile: Profile) => Promise<void>;
  generateRoadmap: (profile: Profile, pathwayTitle: string) => Promise<void>;
  reset: () => void;
}

export const useCareerPlanningStore = create<CareerPlanningState & CareerPlanningActions>(
  (set, get) => ({
    recommendations: null,
    roadmap: null,
    isLoading: false,
    error: null,

    fetchRecommendations: async (profile: Profile) => {
      set({ isLoading: true, error: null });
      try {
        const data = await getCareerRecommendations(profile);
        set({ recommendations: data, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch recommendations',
          isLoading: false,
        });
      }
    },

    generateRoadmap: async (profile: Profile, pathwayTitle: string) => {
      set({ isLoading: true, error: null });
      try {
        const data = await generatePathwayRoadmap(profile, pathwayTitle);
        set({ roadmap: data, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to generate roadmap',
          isLoading: false,
        });
      }
    },

    reset: () => {
      set({ recommendations: null, roadmap: null, error: null, isLoading: false });
    },
  })
);
*/
