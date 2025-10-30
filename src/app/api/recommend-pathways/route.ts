/**
 * @file api/recommend-pathways/route.ts
 * @description API endpoint for generating AI-powered career pathway recommendations
 * @dependencies next/server, @/lib/openrouter, @/lib/types
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCareerRecommendations } from '@/lib/openrouter';
import type { Profile, PathwayRecommendationsResponse } from '@/lib/types';

/**
 * POST /api/recommend-pathways
 *
 * Generates 3-4 career pathway recommendations based on user profile
 *
 * Request body:
 * {
 *   "profile": Profile object with education, skills, experience, etc.
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "recommendations": [
 *       {
 *         "title": "Career Pathway",
 *         "reasoning": "Why this fits...",
 *         "summary": "Brief overview..."
 *       }
 *     ]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { profile } = body;

    // Validate profile data
    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profile data is required',
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

    // Check if profile has enough data for meaningful recommendations
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

    // Call OpenRouter to generate recommendations
    const aiResponse = await generateCareerRecommendations(profile as Profile);

    // Parse the JSON response from AI
    let recommendations: PathwayRecommendationsResponse;
    try {
      recommendations = JSON.parse(aiResponse);
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
    if (!recommendations.recommendations || !Array.isArray(recommendations.recommendations)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format from AI',
        },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error in recommend-pathways API:', error);

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
 * GET /api/recommend-pathways
 *
 * Returns API information (not the main functionality)
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/recommend-pathways',
    method: 'POST',
    description: 'Generate AI-powered career pathway recommendations based on user profile',
    requiredFields: ['profile'],
    profileFields: {
      required: ['userId'],
      recommended: ['skills', 'education', 'experience', 'assessmentScores', 'bio'],
    },
  });
}
