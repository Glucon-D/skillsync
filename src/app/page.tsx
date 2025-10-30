/**
 * @file page.tsx
 * @description Landing page with modern Vercel-style design
 * @dependencies next/link, lucide-react, @/lib/constants
 */

import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, Award, Sparkles, Zap, Users } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 dark:from-primary-500/10 dark:to-primary-600/10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/20 dark:bg-primary-600/10 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-border bg-background/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-text">SkillSync</span>
              </div>
              <div className="flex items-center space-x-3">
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

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-16 sm:pt-32 sm:pb-24 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface border border-border mb-8 text-sm text-text-muted">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span>AI-Powered Career Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text tracking-tight">
              Discover Your
              <span className="block mt-2 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Perfect Career Path
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              Transform your professional journey with AI-powered career recommendations.
              Get personalized pathways, curated courses, and actionable insights tailored to your unique skills and goals.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={ROUTES.SIGNUP}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-200 group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border border-border text-text hover:bg-surface transition-all duration-200"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-bold text-text">10K+</div>
                <div className="text-sm text-text-muted">Active Users</div>
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

          {/* Features Section */}
          <div className="py-20 sm:py-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text">
                Everything you need to
                <span className="block mt-2 text-primary-500">excel in your career</span>
              </h2>
              <p className="mt-6 text-lg text-text-muted max-w-2xl mx-auto">
                Comprehensive tools and resources to guide your professional growth
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <div className="group relative p-8 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">Personalized Assessments</h3>
                  <p className="text-text-muted leading-relaxed">
                    Take comprehensive assessments to discover your strengths, interests, and ideal career paths with AI-driven insights.
                  </p>
                </div>
              </div>

              <div className="group relative p-8 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">Curated Learning Paths</h3>
                  <p className="text-text-muted leading-relaxed">
                    Access personalized roadmaps with hand-picked courses and resources to build the skills you need for success.
                  </p>
                </div>
              </div>

              <div className="group relative p-8 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">Smart Career Matching</h3>
                  <p className="text-text-muted leading-relaxed">
                    Discover opportunities that align perfectly with your profile, complete with salary insights and requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Features */}
          <div className="py-20 border-t border-border">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-2">Lightning Fast</h3>
                  <p className="text-sm text-text-muted">Get instant recommendations powered by cutting-edge AI technology.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-2">Expert Backed</h3>
                  <p className="text-sm text-text-muted">All paths validated by industry professionals and career experts.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-2">Always Updated</h3>
                  <p className="text-sm text-text-muted">Fresh content and pathways aligned with current market demands.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-20 sm:py-32">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-16 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to start your journey?
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10">
                  Join thousands of professionals who have already discovered their perfect career path
                </p>
                <Link
                  href={ROUTES.SIGNUP}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-white text-primary-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-200 group"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-surface/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="font-semibold text-text">SkillSync</span>
              </div>
              <p className="text-sm text-text-muted">
                &copy; 2025 SkillSync. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
