/**
 * @file page.tsx
 * @description Landing page
 * @dependencies next/link, lucide-react, @/lib/constants
 */

import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, Award } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-50/20 dark:to-primary-900/10">
      <nav className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-text">SkillSync</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-base text-text hover:bg-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Sign In
              </Link>
              <Link
                href={ROUTES.SIGNUP}
                className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-base bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-text">
            Discover Your
            <span className="block text-primary-500">Perfect Career Path</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            AI-powered career recommendations tailored to your skills, interests, and goals. 
            Start your journey to professional success today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={ROUTES.SIGNUP}
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6 bg-surface rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text">Personalized Assessments</h3>
            <p className="text-text-muted">
              Take our comprehensive quiz to understand your strengths, interests, and career preferences.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 bg-surface rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text">Skill Pathways</h3>
            <p className="text-text-muted">
              Get curated learning roadmaps with resources to develop skills for your dream career.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 bg-surface rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text">Career Matching</h3>
            <p className="text-text-muted">
              Discover roles that match your profile with detailed requirements and salary insights.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
