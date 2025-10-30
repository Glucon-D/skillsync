/**
 * @file api/analytics/route.ts
 * @description API endpoint for institutional analytics - aggregates student data
 * @dependencies appwrite, @/lib/analytics-utils
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Account, TablesDB, Query } from 'appwrite';
import { DB_CONFIG } from '@/lib/appwrite';
import {
  aggregateSkills,
  aggregateCareers,
  aggregateAssessments,
  aggregateCourses,
  aggregatePathways,
  calculateAverage,
  calculateCompletionRate,
  type AnalyticsData,
} from '@/lib/analytics-utils';
import {
  calculateSkillTrends,
  calculateAssessmentDistribution,
  calculateCourseEngagement,
  calculateProfileFunnel,
  calculateSkillCombinations,
  industryBenchmarks,
  type EnhancedAnalyticsData,
} from '@/lib/analytics-utils-enhanced';

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Unauthorized - No authorization token provided',
      }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Received authorization token');

    // Create server-side Appwrite client for this request
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    // Create account and database instances with this session
    const account = new Account(client);
    const tablesDB = new TablesDB(client);

    // Verify user has "university" label
    let currentUser;
    try {
      currentUser = await account.get();
      console.log('Current user:', currentUser.email, 'Labels:', currentUser.labels);
    } catch (error) {
      console.error('Failed to get user:', error);
      return NextResponse.json({ error: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    // Check if user has "university" label
    const hasUniversityAccess = currentUser.labels?.includes('university');
    if (!hasUniversityAccess) {
      return NextResponse.json(
        { 
          error: 'Forbidden - University access required. Contact admin to add "university" label to your account.',
          debug: {
            userEmail: currentUser.email,
            labels: currentUser.labels || [],
          }
        },
        { status: 403 }
      );
    }

    // Fetch all data from collections (only necessary fields)
    const [profilesResponse, coursesResponse, pathwaysResponse] = await Promise.all([
      tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userProfiles,
        queries: [Query.select(['assessmentScores', 'skills', 'dominantType', 'completionPercentage']), Query.limit(5000)],
      }),
      tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userCourses,
        queries: [Query.select(['platform', 'completed', 'difficulty', 'category', 'bookmarked']), Query.limit(5000)],
      }),
      tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userPathways,
        queries: [Query.select(['completed', 'category', 'level']), Query.limit(5000)],
      }),
    ]);

    const profiles = profilesResponse.rows;
    const courses = coursesResponse.rows;
    const pathways = pathwaysResponse.rows;

    // Aggregate data
    const analytics: AnalyticsData = {
      overview: {
        totalStudents: profilesResponse.total,
        avgProfileCompletion: calculateAverage(profiles, 'completionPercentage'),
        totalCourses: coursesResponse.total,
        courseCompletionRate: calculateCompletionRate(courses),
        totalPathways: pathwaysResponse.total,
        pathwayCompletionRate: calculateCompletionRate(pathways),
      },
      skills: aggregateSkills(profiles),
      careers: aggregateCareers(profiles),
      assessments: aggregateAssessments(profiles),
      courses: aggregateCourses(courses),
      pathways: aggregatePathways(pathways),
    };

    // Enhanced analytics
    const enhanced: Partial<EnhancedAnalyticsData> = {
      skillsDetailed: calculateSkillTrends(profiles),
      assessmentDistribution: calculateAssessmentDistribution(profiles),
      courseEngagement: calculateCourseEngagement(courses),
      profileFunnel: calculateProfileFunnel(profiles),
      skillCombinations: calculateSkillCombinations(profiles),
    };

    return NextResponse.json({
      success: true,
      data: analytics,
      enhanced,
      industryBenchmarks,
      generatedAt: new Date().toISOString(),
      universityUser: {
        name: currentUser.name,
        email: currentUser.email,
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
