/**
 * @file api/courses/generate/route.ts
 * @description API route for AI-powered course generation using OpenRouter
 * @dependencies @/lib/openrouter, @/lib/db, @/lib/appwrite
 */

import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";
import { coursesService } from "@/lib/db";
import type { Course } from "@/lib/types";

const COURSE_GENERATION_PROMPT = `You are a course recommendation expert. Based on the provided domain/topic, recommend exactly 5 high-quality online courses.

For each course, provide:
- title: Full course title
- platform: Platform name (e.g., Coursera, Udemy, edX, LinkedIn Learning, Pluralsight)
- difficulty: One of "beginner", "intermediate", or "advanced"
- price: Approximate price in USD (use 0 for free courses)
- rating: Rating out of 5 (e.g., 4.5)
- url: Valid course URL (use real URLs from platforms)
- category: Course category (e.g., "Web Development", "Data Science")

Return ONLY a valid JSON array with exactly 5 courses. No additional text or explanation.

Example format:
[
  {
    "title": "Complete Web Development Bootcamp",
    "platform": "Udemy",
    "difficulty": "beginner",
    "price": 89.99,
    "rating": 4.7,
    "url": "https://www.udemy.com/course/...",
    "category": "Web Development"
  }
]`;

interface GenerateCoursesRequest {
  userId: string;
  domain: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateCoursesRequest = await request.json();
    const { userId, domain } = body;

    if (!userId || !domain) {
      return NextResponse.json(
        { error: "userId and domain are required" },
        { status: 400 }
      );
    }

    // Call OpenRouter with perplexity/sonar model for web-aware recommendations
    const userPrompt = `Generate 5 course recommendations for the domain: "${domain}". Include recent, popular courses from major platforms. Use real course data and URLs.`;

    let responseText: string;
    try {
      responseText = await callOpenRouter({
        model: "perplexity/sonar",
        systemPrompt: COURSE_GENERATION_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
        maxTokens: 2000,
        temperature: 0.7,
      });
    } catch (error) {
      console.error("OpenRouter API error:", error);
      return NextResponse.json(
        { error: "Failed to generate courses from AI" },
        { status: 500 }
      );
    }

    // Parse the AI response
    let generatedCourses: any[];
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }
      generatedCourses = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Response text:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Validate and transform courses
    if (!Array.isArray(generatedCourses) || generatedCourses.length === 0) {
      return NextResponse.json(
        { error: "Invalid course data generated" },
        { status: 500 }
      );
    }

    // Save courses to database
    const savedCourses: Course[] = [];

    for (const course of generatedCourses.slice(0, 5)) {
      try {
        // Generate unique ID for each course
        const courseId = `gen_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        const courseData: Course = {
          id: courseId,
          title: course.title || "Untitled Course",
          platform: course.platform || "Unknown",
          difficulty: ["beginner", "intermediate", "advanced"].includes(
            course.difficulty
          )
            ? course.difficulty
            : "intermediate",
          price: typeof course.price === "number" ? course.price : 0,
          rating:
            typeof course.rating === "number"
              ? Math.min(5, Math.max(0, course.rating))
              : 4.0,
          url: course.url || "#",
          category: course.category || domain,
        };

        // Save to Appwrite
        const savedCourse = await coursesService.add(userId, courseData);
        savedCourses.push({
          ...courseData,
          $dbId: (savedCourse as any).$id,
        });
      } catch (saveError) {
        console.error("Failed to save course:", saveError);
        // Continue with other courses even if one fails
      }
    }

    if (savedCourses.length === 0) {
      return NextResponse.json(
        { error: "Failed to save any courses" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      courses: savedCourses,
      count: savedCourses.length,
    });
  } catch (error) {
    console.error("Course generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
