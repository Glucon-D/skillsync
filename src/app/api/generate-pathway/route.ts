/**
 * @file api/generate-pathway/route.ts
 * @description API endpoint for generating detailed AI-powered career pathway roadmap
 * @dependencies next/server, @/lib/openrouter, @/lib/types
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePathwayRoadmap } from '@/lib/openrouter';
import type { Profile, GeneratedPathwayResponse } from '@/lib/types';

/**
 * POST /api/generate-pathway
 *
 * Generates a detailed career pathway roadmap for a specific career path
 *
 * Request body:
 * {
 *   "profile": Profile object with education, skills, experience, etc.,
 *   "pathwayTitle": "Desired career pathway title"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "pathway_title": "Career Pathway",
 *     "description": "Overview...",
 *     "steps": [
 *       {
 *         "stage": "Foundation",
 *         "duration": "3-6 months",
 *         "skills": ["skill1", "skill2"],
 *         "milestones": ["milestone1", "milestone2"],
 *         "description": "What you'll learn..."
 *       }
 *     ],
 *     "resources": [
 *       {
 *         "type": "course",
 *         "title": "Resource Name",
 *         "url": "https://example.com",
 *         "description": "What this resource provides"
 *       }
 *     ],
 *     "estimatedDuration": "12-18 months"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { profile, pathwayTitle } = body;

    // Validate required fields
    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profile data is required',
        },
        { status: 400 }
      );
    }

    if (!pathwayTitle || typeof pathwayTitle !== 'string' || pathwayTitle.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'pathwayTitle is required and must be a non-empty string',
        },
        { status: 400 }
      );
    }

    // Basic validation for profile structure
    if (!profile.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profile must include userId',
        },
        { status: 400 }
      );
    }

    // Check if profile has enough data for personalized roadmap
    const hasEnoughData =
      (profile.skills && profile.skills.length > 0) ||
      (profile.education && profile.education.length > 0) ||
      (profile.experience && profile.experience.length > 0) ||
      profile.assessmentScores;

    if (!hasEnoughData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profile must include at least one of: skills, education, experience, or assessment scores',
        },
        { status: 400 }
      );
    }

    // Call OpenRouter to generate detailed pathway roadmap
    const aiResponse = await generatePathwayRoadmap(profile as Profile, pathwayTitle.trim());

    // Parse the JSON response from AI
    let pathwayData: GeneratedPathwayResponse;
    try {
      pathwayData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI response. Please try again.',
        },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (
      !pathwayData.pathway_title ||
      !pathwayData.steps ||
      !Array.isArray(pathwayData.steps) ||
      pathwayData.steps.length === 0
    ) {
      console.error('Invalid AI response structure:', pathwayData);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format from AI',
        },
        { status: 500 }
      );
    }

    // Validate each step has required fields
    const invalidStep = pathwayData.steps.find(
      (step) =>
        !step.stage ||
        !step.duration ||
        !step.skills ||
        !Array.isArray(step.skills) ||
        !step.milestones ||
        !Array.isArray(step.milestones) ||
        !step.description
    );

    if (invalidStep) {
      console.error('Invalid step structure in AI response:', invalidStep);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid step format in AI response',
        },
        { status: 500 }
      );
    }

    // Validate resources if present
    if (pathwayData.resources && Array.isArray(pathwayData.resources)) {
      const invalidResource = pathwayData.resources.find(
        (resource) => !resource.type || !resource.title || !resource.description
      );

      if (invalidResource) {
        console.error('Invalid resource structure in AI response:', invalidResource);
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid resource format in AI response',
          },
          { status: 500 }
        );
      }
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: pathwayData,
    });
  } catch (error) {
    console.error('Error in generate-pathway API:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('OPENROUTER_API_KEY')) {
        return NextResponse.json(
          {
            success: false,
            error: 'OpenRouter API key is not configured',
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-pathway
 *
 * Returns API information (not the main functionality)
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/generate-pathway',
    method: 'POST',
    description: 'Generate a detailed AI-powered career pathway roadmap for a specific career path',
    requiredFields: ['profile', 'pathwayTitle'],
    profileFields: {
      required: ['userId'],
      recommended: ['skills', 'education', 'experience', 'assessmentScores', 'bio'],
    },
    example: {
      profile: {
        userId: 'user123',
        bio: 'Passionate about web development',
        skills: [
          { name: 'JavaScript', level: 'intermediate' },
          { name: 'React', level: 'beginner' },
        ],
        education: [
          {
            school: 'University Name',
            degree: 'Computer Science',
            year: '2024',
          },
        ],
        experience: [],
        completionPercentage: 60,
      },
      pathwayTitle: 'Full Stack Web Developer',
    },
  });
}
