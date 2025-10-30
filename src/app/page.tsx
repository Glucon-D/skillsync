/**
 * @file page.tsx
 * @description Enhanced landing page for SkillSync - AI-Powered Career Path Recommender
 * @dependencies next/link, lucide-react, @/lib/constants, @/components/layout/ThemeToggle
 */

'use client';

import Link from 'next/link';
import {
  ArrowRight, Target, TrendingUp, Award, Sparkles, Zap, Users,
  BookOpen, Briefcase, Map, Compass, BarChart3, Brain, Rocket,
  CheckCircle2, Play, MessageSquare, Building2, LineChart, GraduationCap,
  Code, Lightbulb, ShieldCheck
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 dark:from-primary-500/10 dark:to-primary-600/10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/20 dark:bg-primary-600/10 rounded-full blur-3xl opacity-20 animate-pulse" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-text">SkillSync</span>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-surface transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href={ROUTES.SIGNUP}
                  className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="pt-20 pb-16 sm:pt-32 sm:pb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-text-muted">
                  <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
                  <span>AI-Powered Career Intelligence Platform</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-text tracking-tight">
                  Find Your
                  <span className="block mt-2 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                    Perfect Career Path
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-text-muted leading-relaxed">
                  SkillSync uses AI to analyze your strengths, interests, and goals—delivering personalized career recommendations,
                  skill pathways, and curated learning resources to accelerate your professional journey.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={ROUTES.SIGNUP}
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-200 group"
                  >
                    Find My Career Path
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border-2 border-border text-text hover:bg-surface transition-all duration-200 group">
                    <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-bold text-text">10K+</div>
                    <div className="text-sm text-text-muted">Students Guided</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-bold text-text">500+</div>
                    <div className="text-sm text-text-muted">Career Paths</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-bold text-text">98%</div>
                    <div className="text-sm text-text-muted">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Hero Illustration */}
              <div className="relative lg:block hidden">
                <div className="relative w-full h-[500px] bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-3xl border border-border shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-64 h-64 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                      <Rocket className="absolute inset-0 m-auto w-32 h-32 text-primary-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Problem-Solution Section */}
          <section className="py-20 border-t border-border">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6 order-2 lg:order-1">
                <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">The Problem</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text">
                  Career Misalignment is Costing Students Their Future
                </h2>
                <div className="space-y-4 text-text-muted">
                  <p className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1">•</span>
                    <span>70% of students feel uncertain about their career choices after graduation</span>
                  </p>
                  <p className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Students waste years pursuing paths that don't align with their strengths</span>
                  </p>
                  <p className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Traditional career counseling is generic, outdated, and inaccessible</span>
                  </p>
                </div>
              </div>

              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">The Solution</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text">
                  AI-Driven Career Intelligence That Actually Works
                </h2>
                <div className="space-y-4 text-text-muted">
                  <p className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Personalized assessments that identify your unique strengths and interests</span>
                  </p>
                  <p className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Real-time industry data ensuring recommendations align with market demands</span>
                  </p>
                  <p className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span>Step-by-step roadmaps with curated courses and portfolio guidance</span>
                  </p>
                </div>
                <Link
                  href={ROUTES.SIGNUP}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all duration-200 group"
                >
                  Start Your Assessment
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="py-20 border-t border-border">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Platform Features</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text">
                Everything You Need to
                <span className="block mt-2 text-primary-500">Build Your Dream Career</span>
              </h2>
              <p className="mt-6 text-lg text-text-muted max-w-2xl mx-auto">
                Comprehensive AI-powered tools designed to guide every step of your professional journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature Card 1 */}
              <div className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Student Profiling</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Comprehensive analysis of your skills, personality, and aspirations
                  </p>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Interest Mapping</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Discover careers that truly align with your passions and values
                  </p>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Industry Integration</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Real-time market insights powered by RAG technology
                  </p>
                </div>
              </div>

              {/* Feature Card 4 */}
              <div className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <Map className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Skill Pathways</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Step-by-step roadmaps to build in-demand professional skills
                  </p>
                </div>
              </div>

              {/* Feature Card 5 */}
              <div className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Course Recommendation</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Curated learning resources tailored to your career goals
                  </p>
                </div>
              </div>

              {/* Feature Card 6 */}
              <div className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Career Role Suggestions</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Discover roles with salary insights and growth potential
                  </p>
                </div>
              </div>

              {/* Feature Card 7 */}
              <div className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Portfolio Roadmap</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Build a standout portfolio with project recommendations
                  </p>
                </div>
              </div>

              {/* Feature Card 8 */}
              <div className="group relative p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Institutional Analytics</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Data-driven insights for universities and educators
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 border-t border-border">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Simple Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text">
                Your Journey to Career Success
                <span className="block mt-2 text-primary-500">in 4 Simple Steps</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/25">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text">Sign Up Free</h3>
                  <p className="text-text-muted">Create your account in seconds and get started with your assessment</p>
                </div>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-10 -right-4 text-primary-500/30">
                  <ArrowRight size={32} />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/25">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text">Take Assessment</h3>
                  <p className="text-text-muted">Complete our AI-powered test to identify your skills and interests</p>
                </div>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-10 -right-4 text-primary-500/30">
                  <ArrowRight size={32} />
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/25">
                      <Lightbulb className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text">Get AI Insights</h3>
                  <p className="text-text-muted">Receive personalized career recommendations and skill gap analysis</p>
                </div>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-10 -right-4 text-primary-500/30">
                  <ArrowRight size={32} />
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/25">
                      <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      4
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text">Follow Roadmap</h3>
                  <p className="text-text-muted">Access your customized learning path with courses and milestones</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href={ROUTES.SIGNUP}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-200 group"
              >
                Start Your Journey Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>

          {/* Dashboard Preview Section */}
          <section className="py-12 border-t border-border">
            <div className="text-center mb-8">
              <div className="inline-block px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">Platform Preview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text">
                Your Personalized <span className="text-primary-500">Career Dashboard</span>
              </h2>
              <p className="mt-3 text-sm text-text-muted max-w-2xl mx-auto">
                Track your progress, explore pathways, and access resources—all in one interface
              </p>
            </div>

            {/* Dummy Dashboard */}
            <div className="relative rounded-2xl bg-gradient-to-br from-primary-500/5 to-primary-600/5 border border-border shadow-xl overflow-hidden p-4 sm:p-6">
              {/* Welcome Header */}
              <div className="mb-4 pb-4 border-b border-border">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-text">Welcome back, Gautam Kakkar!</h3>
                    <p className="text-xs text-text-muted">Here's your career progress overview</p>
                  </div>
                  <Link
                    href={ROUTES.SIGNUP}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {/* Career Fit Score */}
                <div className="relative p-3 bg-surface/70 backdrop-blur-sm rounded-xl border border-border hover:border-primary-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full">+5%</span>
                  </div>
                  <p className="text-xs text-text-muted mb-0.5">Career Fit</p>
                  <p className="text-xl font-bold text-text">85%</p>
                </div>

                {/* Skills Progress */}
                <div className="relative p-3 bg-surface/70 backdrop-blur-sm rounded-xl border border-border hover:border-primary-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full">+12%</span>
                  </div>
                  <p className="text-xs text-text-muted mb-0.5">Skills</p>
                  <p className="text-xl font-bold text-text">70%</p>
                </div>

                {/* Recommended Courses */}
                <div className="relative p-3 bg-surface/70 backdrop-blur-sm rounded-xl border border-border hover:border-primary-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full">New</span>
                  </div>
                  <p className="text-xs text-text-muted mb-0.5">Courses</p>
                  <p className="text-xl font-bold text-text">3</p>
                </div>

                {/* Next Goal */}
                <div className="relative p-3 bg-surface/70 backdrop-blur-sm rounded-xl border border-border hover:border-primary-500/50 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-2">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-text-muted mb-0.5">Next Goal</p>
                  <p className="text-xs font-semibold text-text line-clamp-2">Learn React Advanced</p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Skill Growth Chart */}
                <div className="p-4 bg-surface/70 backdrop-blur-sm rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-text">Skill Growth</h4>
                    <span className="text-xs text-text-muted">6 months</span>
                  </div>

                  {/* Static Bar Chart */}
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text">JavaScript</span>
                        <span className="text-xs font-semibold text-primary-500">85%</span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text">React</span>
                        <span className="text-xs font-semibold text-primary-500">75%</span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text">TypeScript</span>
                        <span className="text-xs font-semibold text-primary-500">65%</span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text">Node.js</span>
                        <span className="text-xs font-semibold text-primary-500">70%</span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Career Roles */}
                <div className="p-4 bg-surface/70 backdrop-blur-sm rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-text">Top Career Matches</h4>
                    <button className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors">
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {/* Role 1 */}
                    <div className="flex items-start space-x-3 p-2.5 bg-background/50 rounded-lg border border-border hover:border-primary-500/50 transition-all duration-300 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h5 className="text-sm font-semibold text-text group-hover:text-primary-500 transition-colors">Data Analyst</h5>
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">92%</span>
                        </div>
                        <p className="text-xs text-text-muted mb-1">Drive decisions with data analysis</p>
                        <span className="text-xs text-text-muted bg-primary-500/10 px-1.5 py-0.5 rounded-full">$75k - $120k</span>
                      </div>
                    </div>

                    {/* Role 2 */}
                    <div className="flex items-start space-x-3 p-2.5 bg-background/50 rounded-lg border border-border hover:border-primary-500/50 transition-all duration-300 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h5 className="text-sm font-semibold text-text group-hover:text-primary-500 transition-colors">Product Manager</h5>
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">88%</span>
                        </div>
                        <p className="text-xs text-text-muted mb-1">Lead product development</p>
                        <span className="text-xs text-text-muted bg-primary-500/10 px-1.5 py-0.5 rounded-full">$90k - $150k</span>
                      </div>
                    </div>

                    {/* Role 3 */}
                    <div className="flex items-start space-x-3 p-2.5 bg-background/50 rounded-lg border border-border hover:border-primary-500/50 transition-all duration-300 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h5 className="text-sm font-semibold text-text group-hover:text-primary-500 transition-colors">UX Designer</h5>
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">85%</span>
                        </div>
                        <p className="text-xs text-text-muted mb-1">Create intuitive experiences</p>
                        <span className="text-xs text-text-muted bg-primary-500/10 px-1.5 py-0.5 rounded-full">$70k - $130k</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4 text-center">
                <Link
                  href={ROUTES.SIGNUP}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold rounded-lg bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all duration-200 group"
                >
                  Unlock Full Dashboard
                  <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 border-t border-border">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Student Success Stories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text">
                Trusted by Students
                <span className="block mt-2 text-primary-500">Across the Globe</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="relative p-8 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 text-primary-500 fill-primary-500" />
                  ))}
                </div>
                <p className="text-text-muted mb-6 leading-relaxed">
                  "SkillSync helped me discover my passion for UX design. The personalized roadmap and course recommendations were exactly what I needed to transition careers successfully."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-text">Sarah Chen</div>
                    <div className="text-sm text-text-muted">UX Designer</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="relative p-8 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 text-primary-500 fill-primary-500" />
                  ))}
                </div>
                <p className="text-text-muted mb-6 leading-relaxed">
                  "The AI assessment was incredibly accurate. It identified skills I didn't even know I had and suggested career paths I never considered. Best decision ever!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-text">Michael Roberts</div>
                    <div className="text-sm text-text-muted">Data Analyst</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="relative p-8 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 text-primary-500 fill-primary-500" />
                  ))}
                </div>
                <p className="text-text-muted mb-6 leading-relaxed">
                  "As a career counselor, I recommend SkillSync to all my students. The platform's insights and recommendations are backed by real industry data."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div>
                    <div className="font-semibold text-text">Priya Sharma</div>
                    <div className="text-sm text-text-muted">Career Counselor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Banner */}
            <div className="mt-16 text-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-8 px-8 py-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium text-text">Verified Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium text-text">10,000+ Active Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium text-text">98% Success Rate</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI Mentorship Section */}
          <section className="py-20 border-t border-border">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="relative w-full h-[400px] bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-3xl border border-border shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-20 blur-3xl"></div>
                      <Brain className="absolute inset-0 m-auto w-24 h-24 text-primary-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">AI-Powered Mentorship</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text">
                  Your Personal AI Career
                  <span className="block mt-2 text-primary-500">Mentor & Simulator</span>
                </h2>
                <p className="text-lg text-text-muted leading-relaxed">
                  Get real-time guidance from our advanced AI mentor. Practice interviews, receive feedback on your portfolio,
                  and simulate real-world career scenarios to build confidence before stepping into the professional world.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-text mb-1">24/7 Career Guidance</h4>
                      <p className="text-sm text-text-muted">Ask questions and get instant, personalized career advice</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-text mb-1">Interview Simulation</h4>
                      <p className="text-sm text-text-muted">Practice with AI-powered mock interviews tailored to your field</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-text mb-1">Creative Project Ideas</h4>
                      <p className="text-sm text-text-muted">Get unique portfolio project suggestions to stand out</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Institutional Analytics Section */}
          <section className="py-20 border-t border-border">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <div className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">For Universities</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text">
                  Empower Your Institution with
                  <span className="block mt-2 text-primary-500">Data-Driven Analytics</span>
                </h2>
                <p className="text-lg text-text-muted leading-relaxed">
                  Universities and educators can access powerful analytics dashboards to track student engagement,
                  career outcomes, and program effectiveness—helping you better support your students' success.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <LineChart className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-text mb-1">Student Progress Tracking</h4>
                      <p className="text-sm text-text-muted">Monitor career development across your entire student body</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-text mb-1">Program Insights</h4>
                      <p className="text-sm text-text-muted">Evaluate course effectiveness and identify improvement areas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-text mb-1">Outcome Metrics</h4>
                      <p className="text-sm text-text-muted">Track placement rates and career success post-graduation</p>
                    </div>
                  </div>
                </div>
                <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 transition-all duration-200">
                  Request Institutional Demo
                </button>
              </div>

              <div className="relative order-1 lg:order-2">
                <div className="relative w-full h-[400px] bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-3xl border border-border shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-20 blur-3xl"></div>
                      <BarChart3 className="absolute inset-0 m-auto w-24 h-24 text-primary-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 sm:py-32">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-16 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
                  <Rocket className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Start Today</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Ready to Start Your
                  <span className="block mt-2">AI-Guided Career Journey?</span>
                </h2>

                <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10">
                  Join thousands of students who have already discovered their perfect career path with SkillSync.
                  Your future starts here.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href={ROUTES.SIGNUP}
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-white text-primary-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-200 group"
                  >
                    Get Started for Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={ROUTES.LOGIN}
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>

                <p className="mt-8 text-sm text-white/75">
                  No credit card required • Free forever • 2-minute setup
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-surface/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <span className="font-semibold text-text">SkillSync</span>
                </div>
                <p className="text-sm text-text-muted">
                  AI-powered career intelligence platform helping students discover their perfect career path.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-4">Platform</h3>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">How It Works</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">For Universities</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">Career Guide</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">API Docs</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-primary-500 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-text-muted">
                &copy; 2025 SkillSync. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-text-muted">
                <Link href="#" className="hover:text-primary-500 transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-primary-500 transition-colors">LinkedIn</Link>
                <Link href="#" className="hover:text-primary-500 transition-colors">GitHub</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
