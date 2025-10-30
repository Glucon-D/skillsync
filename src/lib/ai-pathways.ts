/**
 * @file ai-pathways.ts
 * @description Helper functions for AI-powered career pathway generation using OpenRouter
 * @dependencies @/lib/openrouter, @/lib/types
 */

import { callOpenRouter } from './openrouter';
import type { Profile } from './types';

// Model to use for pathway generation
const MODEL = 'google/gemini-2.5-flash-lite';

/**
 * Format user profile data for AI prompt
 */
function formatProfileForPrompt(profile: Profile): string {
  const parts: string[] = [];

  // Basic info
  parts.push(`Name: ${profile.userId || 'Not provided'}`);
  if (profile.bio) {
    parts.push(`Bio: ${profile.bio}`);
  }

  // Education
  if (profile.education && profile.education.length > 0) {
    parts.push('\nEducation:');
    profile.education.forEach((edu) => {
      parts.push(`- ${edu.degree} from ${edu.school} (${edu.year})${edu.gpa ? `, GPA: ${edu.gpa}` : ''}`);
    });
  }

  // Skills
  if (profile.skills && profile.skills.length > 0) {
    parts.push('\nSkills:');
    profile.skills.forEach((skill) => {
      parts.push(`- ${skill.name} (${skill.level})`);
    });
  }

  // Experience
  if (profile.experience && profile.experience.length > 0) {
    parts.push('\nExperience:');
    profile.experience.forEach((exp) => {
      parts.push(`- ${exp.title} (${exp.duration})`);
      parts.push(`  Description: ${exp.description}`);
      if (exp.techStack && exp.techStack.length > 0) {
        parts.push(`  Tech Stack: ${exp.techStack.join(', ')}`);
      }
    });
  }

  // Assessment scores
  if (profile.assessmentScores) {
    parts.push('\nAssessment Scores:');
    parts.push(`- Technical: ${profile.assessmentScores.technical}`);
    parts.push(`- Creative: ${profile.assessmentScores.creative}`);
    parts.push(`- Analytical: ${profile.assessmentScores.analytical}`);
    parts.push(`- Leadership: ${profile.assessmentScores.leadership}`);
    parts.push(`- Communication: ${profile.assessmentScores.communication}`);
    if (profile.dominantType) {
      parts.push(`- Dominant Type: ${profile.dominantType}`);
    }
  }

  return parts.join('\n');
}

/**
 * Generate 3-4 career pathway recommendations based on user profile
 */
export async function generateCareerRecommendations(profile: Profile): Promise<string> {
  const profileContext = formatProfileForPrompt(profile);

  const systemPrompt = `You are an expert career advisor AI that analyzes student profiles and recommends suitable career pathways.

Your task is to analyze the provided profile and recommend 3-4 career pathways that align well with the person's education, skills, experience, and assessment scores.

For each recommendation, provide:
1. title: A clear, specific career pathway title
2. reasoning: A 2-3 sentence explanation of why this pathway suits the profile
3. summary: A brief 1-2 sentence overview of what this career path entails

Consider:
- Educational background and current knowledge level
- Technical and soft skills
- Assessment scores (technical, creative, analytical, leadership, communication)
- Work experience and projects
- Growth potential and market demand
- Realistic progression paths

Return your response ONLY as a valid JSON object with this exact structure:
{
  "recommendations": [
    {
      "title": "Career Pathway Title",
      "reasoning": "Why this pathway fits...",
      "summary": "Brief overview..."
    }
  ]
}`;

  const userPrompt = `Please analyze this profile and recommend 3-4 suitable career pathways:\n\n${profileContext}`;

  return await callOpenRouter({
    model: MODEL,
    systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxTokens: 2000,
    temperature: 0.7,
    responseFormat: 'json_object',
  });
}

/**
 * Generate a detailed career pathway roadmap for a specific pathway
 */
export async function generatePathwayRoadmap(
  profile: Profile,
  pathwayTitle: string
): Promise<string> {
  const profileContext = formatProfileForPrompt(profile);

  const systemPrompt = `You are an expert career development advisor that creates detailed, personalized career roadmaps.

Your task is to create a comprehensive step-by-step roadmap for the specified career pathway, tailored to the individual's current profile.

The roadmap should include:
1. pathway_title: The career pathway name
2. description: A 2-3 sentence overview of this career path
3. steps: An array of learning stages, each with:
   - stage: Stage name (e.g., "Foundation", "Intermediate", "Advanced", "Expert")
   - duration: Estimated time to complete (e.g., "3-6 months")
   - skills: Array of specific skills to acquire in this stage
   - milestones: Array of concrete achievements/projects to complete
   - description: What the learner will accomplish in this stage
4. resources: An array of recommended resources:
   - type: "course" | "book" | "certification" | "project" | "community"
   - title: Resource name
   - url: Optional URL (use null if not applicable)
   - description: Brief description of the resource
5. estimatedDuration: Total time to complete the pathway (e.g., "12-18 months")

Consider the person's current skill level and create realistic, achievable steps. Start from where they are now, not from scratch.

Return your response ONLY as a valid JSON object with this exact structure:
{
  "pathway_title": "Career Pathway",
  "description": "Overview...",
  "steps": [
    {
      "stage": "Foundation",
      "duration": "3-6 months",
      "skills": ["skill1", "skill2"],
      "milestones": ["milestone1", "milestone2"],
      "description": "What you'll learn..."
    }
  ],
  "resources": [
    {
      "type": "course",
      "title": "Resource Name",
      "url": "https://example.com",
      "description": "What this resource provides"
    }
  ],
  "estimatedDuration": "12-18 months"
}`;

  const userPrompt = `Create a personalized roadmap for this career pathway: "${pathwayTitle}"

Based on this profile:
${profileContext}

Generate a detailed, step-by-step roadmap tailored to their current level and background.`;

  return await callOpenRouter({
    model: MODEL,
    systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxTokens: 3000,
    temperature: 0.7,
    responseFormat: 'json_object',
  });
}
