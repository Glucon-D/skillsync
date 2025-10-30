/**
 * @file (dashboard)/courses/page.tsx
 * @description Courses recommendation page with AI-powered generation
 * @dependencies react, lucide-react, @/store/coursesStore, @/store/authStore, @/components/ui
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Star,
  Clock,
  DollarSign,
  Plus,
  Sparkles,
  Filter,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { useCoursesStore } from '@/store/coursesStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

const POPULAR_DOMAINS = [
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Mobile Development',
  'Cloud Computing',
  'Cybersecurity',
  'DevOps',
  'UI/UX Design',
];

export default function CoursesPage() {
  const user = useAuthStore((state) => state.user);
  const {
    toggleBookmark,
    isBookmarked,
    allCourses,
    bookmarkedCourses,
    loadCourses,
    isLoading: storeLoading
  } = useCoursesStore();

  const [activeTab, setActiveTab] = useState<'all' | 'bookmarked'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // AI Generation state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string>('');
  const [generationSuccess, setGenerationSuccess] = useState<string>('');

  // Load user's courses on mount
  useEffect(() => {
    if (user?.id) {
      loadCourses(user.id);
    }
  }, [user?.id, loadCourses]);

  // Filter courses based on active tab and filters
  const coursesToDisplay = activeTab === 'all' ? allCourses : bookmarkedCourses;

  const displayCourses = coursesToDisplay
    .filter((course) => {
      if (difficultyFilter !== 'all' && course.difficulty !== difficultyFilter) return false;
      if (platformFilter !== 'all' && course.platform !== platformFilter) return false;
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by creation date: latest first (descending order)
      if (!a.$createdAt || !b.$createdAt) return 0;
      return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
    });

  const platforms = Array.from(new Set(allCourses.map(c => c.platform)));

  const handleGenerateCourses = async () => {
    if (!user?.id) {
      setGenerationError('Please log in to generate courses');
      return;
    }

    const domain = customDomain.trim() || selectedDomain;
    if (!domain) {
      setGenerationError('Please select or enter a domain');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');
    setGenerationSuccess('');

    try {
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          domain,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate courses');
      }

      // Close modal and show success
      setIsGenerateModalOpen(false);
      setSelectedDomain('');
      setCustomDomain('');
      setGenerationSuccess(`Successfully generated ${data.count} courses for ${domain}! Browse them in the All Courses tab and bookmark your favorites.`);

      // Reload courses to show new ones
      if (user?.id) {
        await loadCourses(user.id);
      }

      // Clear success message after 5 seconds
      setTimeout(() => setGenerationSuccess(''), 5000);
    } catch (error) {
      console.error('Course generation error:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate courses');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetModal = () => {
    setIsGenerateModalOpen(false);
    setSelectedDomain('');
    setCustomDomain('');
    setGenerationError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Course Recommendations</h1>
          <p className="text-text-muted mt-1">Discover and manage your learning journey</p>
        </div>
        <Button
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Generate Courses
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>

      {/* Success Message */}
      {generationSuccess && (
        <Card className="border-green-500 bg-green-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-400">{generationSuccess}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'all'
                ? 'text-primary-500'
                : 'text-text-muted hover:text-text'
            }`}
          >
            All Courses
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookmarked')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'bookmarked'
                ? 'text-primary-500'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Bookmarked ({bookmarkedCourses.length})
            {activeTab === 'bookmarked' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Search"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                label="Difficulty"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
              <Select
                label="Platform"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
              >
                <option value="all">All Platforms</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {storeLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      )}

      {/* Empty State */}
      {!storeLoading && displayCourses.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center text-center">
              <GraduationCap className="w-16 h-16 text-text-muted mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">
                {activeTab === 'bookmarked'
                  ? 'No bookmarked courses yet'
                  : 'No courses yet'}
              </h3>
              <p className="text-text-muted mb-6 max-w-md">
                {activeTab === 'bookmarked'
                  ? 'Bookmark courses from the All Courses tab to see them here.'
                  : 'Generate AI-powered course recommendations to get started with your learning journey.'}
              </p>
              <Button
                onClick={() => setIsGenerateModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Grid */}
      {!storeLoading && displayCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course) => {
            const bookmarked = isBookmarked(course.id);

            return (
              <Card key={course.id} hover className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 flex-1">
                      {course.title}
                    </CardTitle>
                    <button
                      onClick={() => user?.id && toggleBookmark(user.id, course)}
                      className="flex-shrink-0 p-1 hover:bg-background rounded transition-colors"
                      disabled={!user?.id}
                      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="w-5 h-5 text-primary-500" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-text-muted hover:text-primary-500" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  {course.instructor && (
                    <p className="text-sm text-text-muted line-clamp-1">{course.instructor}</p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge>{course.platform}</Badge>
                    <Badge variant={
                      course.difficulty === 'beginner' ? 'default' :
                      course.difficulty === 'intermediate' ? 'warning' : 'error'
                    }>
                      {course.difficulty}
                    </Badge>
                    {course.category && (
                      <Badge variant="secondary">{course.category}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-text-muted">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center text-text-muted">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                    <div className="flex items-center text-lg font-bold text-text">
                      {course.price === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5" />
                          {course.price}
                        </>
                      )}
                    </div>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (course.url === '#') {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={course.url === '#'}
                      >
                        View
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* AI Generation Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={resetModal}
        title="Generate AI-Powered Courses"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-text font-medium mb-1">AI-Powered Recommendations</p>
              <p className="text-text-muted">
                Select a domain or enter a custom topic to get 5 personalized course recommendations
                from top platforms like Udemy, Coursera, and more.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-3">
                Popular Domains
              </label>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_DOMAINS.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => {
                      setSelectedDomain(domain);
                      setCustomDomain('');
                    }}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      selectedDomain === domain
                        ? 'border-primary-500 bg-primary-500/10 text-primary-500 shadow-sm'
                        : 'border-border hover:border-primary-500/50 text-text hover:bg-primary-500/5'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-muted">OR</span>
              </div>
            </div>

            <Input
              label="Custom Domain/Topic"
              placeholder="e.g., Natural Language Processing, Game Development, Blockchain..."
              value={customDomain}
              onChange={(e) => {
                setCustomDomain(e.target.value);
                if (e.target.value.trim()) {
                  setSelectedDomain('');
                }
              }}
            />
          </div>

          {generationError && (
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{generationError}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={resetModal}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateCourses}
              disabled={isGenerating || (!selectedDomain && !customDomain.trim())}
              className="flex items-center gap-2 min-w-[140px] justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
