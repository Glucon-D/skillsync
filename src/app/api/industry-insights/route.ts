/**
 * @file api/industry-insights/route.ts
 * @description API endpoint for fetching real-time industry trends using Perplexity Sonar
 * @dependencies next/server, @/lib/openrouter, @/lib/types
 */

import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import type { Profile } from '@/lib/types';

// In-memory cache (24 hours TTL)
const cache = new Map<string, { data: IndustryInsightsResponse; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const INDUSTRY_INSIGHTS_PROMPT = `You are an industry trends analyst providing clean, actionable insights for a professional career platform.

CRITICAL FORMATTING RULES:
1. Return ONLY valid JSON - no markdown, no code blocks, no extra text
2. NEVER include citation numbers like [1], [2], [3] or [6] in any text
3. Write descriptions in plain, natural language without reference markers
4. Use complete sentences with proper punctuation
5. Include specific numbers, percentages, and timeframes directly in the text

CONTENT REQUIREMENTS:
Generate exactly 10-15 insights distributed as:
- 5-7 insights about job demand trends (category: "job_demand")
- 2-3 insights about salary growth (category: "salary_growth")
- 3-5 insights about emerging skills (category: "emerging_skill")

For EACH insight, provide:
{
  "trend": "Clear, professional title (max 60 characters)",
  "description": "One complete sentence with specific data. Example: 'Cloud engineers saw 45% salary increase in 2024, with average compensation reaching $140k-180k annually.' NO citation numbers.",
  "relevance": "high" | "medium" | "low",
  "category": "job_demand" | "salary_growth" | "emerging_skill"
}

Also provide:
- jobMarketTrend: One complete sentence describing overall 2025 tech job market outlook. NO citations.
- topSkillsDemand: Array of exactly 5 skill names (e.g., ["Python", "AWS", "React", "Machine Learning", "Docker"])
- avgSalaryGrowth: Simple format like "8-12% in 2024-2025" or "10% annually". NO additional text.

EXAMPLE OUTPUT (follow this exact structure):
{
  "insights": [
    {
      "trend": "AI Engineers Command Premium Salaries",
      "description": "AI and machine learning engineers saw average salary increases of 35% in 2024, with senior positions reaching $180k-250k in major tech hubs.",
      "relevance": "high",
      "category": "job_demand"
    },
    {
      "trend": "Cloud Architecture Roles Surge",
      "description": "Demand for cloud architects grew 62% year-over-year, driven by enterprise migration to hybrid cloud infrastructure.",
      "relevance": "high",
      "category": "job_demand"
    },
    {
      "trend": "Tech Salary Growth Stabilizes",
      "description": "After 2023 corrections, tech salaries grew steadily at 8-10% in 2024, with projections for similar growth in 2025.",
      "relevance": "high",
      "category": "salary_growth"
    },
    {
      "trend": "GenAI Skills Become Table Stakes",
      "description": "Over 65% of software engineering roles now list generative AI experience as preferred or required qualification.",
      "relevance": "high",
      "category": "emerging_skill"
    }
  ],
  "jobMarketTrend": "The tech job market in 2025 shows strong growth in AI, cloud, and cybersecurity roles, with experienced professionals commanding premium compensation.",
  "topSkillsDemand": ["Python", "AWS/Cloud", "React", "AI/ML", "DevOps"],
  "avgSalaryGrowth": "8-12% in 2024-2025"
}

Remember: NEVER include [1], [2], [3], [6] or any citation markers. Write naturally.`;

interface IndustryInsight {
  trend: string;
  description: string;
  relevance: 'high' | 'medium' | 'low';
  category: 'job_demand' | 'salary_growth' | 'emerging_skill';
}

interface IndustryInsightsResponse {
  insights: IndustryInsight[];
  jobMarketTrend: string;
  topSkillsDemand: string[];
  avgSalaryGrowth: string;
  generatedAt: string;
  isProfileBased: boolean;
}

/**
 * POST /api/industry-insights
 *
 * Fetches real-time industry trends and insights using Perplexity Sonar
 * If profile is provided, returns personalized insights
 * Otherwise, returns general market trends
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, forceRefresh } = body as { profile?: Profile; forceRefresh?: boolean };

    // Generate cache key based on profile data
    const cacheKey = profile
      ? `profile_${profile.userId}_${profile.skills?.map(s => s.name).join(',')}_${profile.dominantType || 'general'}`
      : 'general_trends';

    // Check cache (skip if force refresh requested)
    if (!forceRefresh) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({
          success: true,
          data: cached.data,
          cached: true,
        });
      }
    }

    // Build context for Perplexity based on profile
    let userPrompt = '';
    const hasProfile = profile && (
      (profile.skills && profile.skills.length > 0) ||
      (profile.experience && profile.experience.length > 0) ||
      (profile.education && profile.education.length > 0)
    );

    if (hasProfile) {
      // Build detailed profile context
      const contextParts: string[] = [];

      // Skills
      if (profile.skills && profile.skills.length > 0) {
        const skillsByLevel = {
          advanced: profile.skills.filter(s => s.level === 'advanced').map(s => s.name),
          intermediate: profile.skills.filter(s => s.level === 'intermediate').map(s => s.name),
          beginner: profile.skills.filter(s => s.level === 'beginner').map(s => s.name),
        };

        if (skillsByLevel.advanced.length > 0) {
          contextParts.push(`Advanced skills: ${skillsByLevel.advanced.slice(0, 5).join(', ')}`);
        }
        if (skillsByLevel.intermediate.length > 0) {
          contextParts.push(`Intermediate skills: ${skillsByLevel.intermediate.slice(0, 3).join(', ')}`);
        }
      }

      // Experience
      if (profile.experience && profile.experience.length > 0) {
        const recentRole = profile.experience[0];
        contextParts.push(`Current/Recent role: ${recentRole.title}`);
        if (recentRole.techStack && recentRole.techStack.length > 0) {
          contextParts.push(`Tech stack experience: ${recentRole.techStack.slice(0, 5).join(', ')}`);
        }
      }

      // Education
      if (profile.education && profile.education.length > 0) {
        const latestEdu = profile.education[0];
        contextParts.push(`Education: ${latestEdu.degree} in ${latestEdu.school}`);
      }

      // Aptitude/Assessment
      if (profile.dominantType) {
        contextParts.push(`Career aptitude: ${profile.dominantType}`);
      }

      userPrompt = `Provide highly personalized industry insights for a professional with the following profile:

${contextParts.join('\n')}

Focus on:
1. Job market trends specifically relevant to their skill set and experience level
2. Salary growth projections for their career path and skills
3. Emerging skills they should learn next based on their current expertise
4. Career advancement opportunities in their domain

Make insights actionable and directly relevant to their profile.`;
    } else {
      userPrompt = `Provide general industry insights for the technology and professional job market in 2025. Cover broad trends across:
- Software Development (Web, Mobile, Backend)
- Data Science & AI/ML
- Cloud Computing & DevOps
- Cybersecurity
- Emerging technologies

Focus on entry-level to mid-level opportunities and skills.`;
    }

    // Call Perplexity Sonar via OpenRouter
    let responseText: string;
    try {
      responseText = await callOpenRouter({
        model: 'perplexity/sonar',
        systemPrompt: INDUSTRY_INSIGHTS_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
        maxTokens: 2500,
        temperature: 0.3,
      });
    } catch (error) {
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch industry insights from AI',
        },
        { status: 500 }
      );
    }

    // Parse AI response
    let insightsData: IndustryInsightsResponse;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      const parsed = JSON.parse(jsonMatch[0]);

      // Clean up any citation numbers that might have slipped through
      const cleanText = (text: string): string => {
        if (!text) return text;
        // Remove citation patterns like [1], [2], [3], [1][2], etc.
        return text
          .replace(/\[\d+\]/g, '') // Remove [1], [2], etc.
          .replace(/\[[\d,\s]+\]/g, '') // Remove [1, 2, 3]
          .replace(/\s+/g, ' ') // Clean up extra spaces
          .trim();
      };

      // Clean all text fields
      if (parsed.insights && Array.isArray(parsed.insights)) {
        parsed.insights = parsed.insights.map((insight: IndustryInsight) => ({
          ...insight,
          trend: cleanText(insight.trend),
          description: cleanText(insight.description),
        }));
      }

      if (parsed.jobMarketTrend) {
        parsed.jobMarketTrend = cleanText(parsed.jobMarketTrend);
      }

      if (parsed.avgSalaryGrowth) {
        parsed.avgSalaryGrowth = cleanText(parsed.avgSalaryGrowth);
      }

      insightsData = {
        ...parsed,
        generatedAt: new Date().toISOString(),
        isProfileBased: !!profile,
      };
    } catch (parseError) {
      console.error('Failed to parse Perplexity response:', parseError);
      console.error('Response text:', responseText);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse industry insights data',
        },
        { status: 500 }
      );
    }

    // Validate response structure
    if (!insightsData.insights || !Array.isArray(insightsData.insights)) {
      console.error('Invalid insights structure:', insightsData);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response structure from AI',
        },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!insightsData.jobMarketTrend || !insightsData.topSkillsDemand || !insightsData.avgSalaryGrowth) {
      console.error('Missing required fields in response:', insightsData);
      return NextResponse.json(
        {
          success: false,
          error: 'Incomplete data from AI',
        },
        { status: 500 }
      );
    }

    // Cache the result
    cache.set(cacheKey, {
      data: insightsData,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      data: insightsData,
      cached: false,
    });
  } catch (error) {
    console.error('Error in industry-insights API:', error);

    if (error instanceof Error) {
      if (error.message.includes('OPENROUTER_API_KEY')) {
        return NextResponse.json(
          {
            success: false,
            error: 'API key not configured',
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
 * GET /api/industry-insights
 * Returns API information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/industry-insights',
    method: 'POST',
    description: 'Fetch real-time industry trends and insights using Perplexity Sonar',
    parameters: {
      profile: 'Optional Profile object for personalized insights based on skills and aptitude',
    },
    features: [
      'Real-time job demand trends',
      'Salary growth statistics',
      'Emerging skills analysis',
      'Personalized or general market insights',
    ],
    caching: '24 hours in-memory cache',
    model: 'perplexity/sonar',
  });
}
