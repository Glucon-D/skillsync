/**
 * @file (dashboard)/courses/page.tsx
 * @description Courses recommendation page with AI-powered generation
 * @dependencies react, lucide-react, @/store/coursesStore, @/store/authStore, @/components/ui
 */

'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
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
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckSquare,
  Square
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

const COURSES_PER_PAGE = 12;

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
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selection and deletion state
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showBookmarkSuccess, setShowBookmarkSuccess] = useState(false);

  // AI Generation state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string>('');

  // Load user's courses on mount
  useEffect(() => {
    if (user?.id) {
      loadCourses(user.id);
    }
  }, [user?.id, loadCourses]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Filter courses based on active tab and filters
  const coursesToDisplay = activeTab === 'all' ? allCourses : bookmarkedCourses;

  const filteredCourses = coursesToDisplay
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const displayCourses = filteredCourses.slice(startIndex, endIndex);

  // Reset to page 1 and clear selections when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedCourseIds(new Set());
  }, [activeTab, difficultyFilter, platformFilter, searchQuery]);

  // Selection handlers
  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourseIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCourseIds.size === displayCourses.length) {
      // Deselect all
      setSelectedCourseIds(new Set());
    } else {
      // Select all on current page
      const allIds = new Set(displayCourses.map((course) => course.id));
      setSelectedCourseIds(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCourseIds.size === 0) return;

    // For now, we'll just show a success toast and clear selection
    // In a real app, you'd call an API to delete from backend
    const count = selectedCourseIds.size;

    toast.success(
      `Successfully deleted ${count} course${count > 1 ? 's' : ''}!`,
      {
        duration: 4000,
        position: 'top-center',
      }
    );

    setSelectedCourseIds(new Set());
    setShowDeleteModal(false);
    setIsSelectMode(false);

    // TODO: Implement actual deletion from backend
    // await deleteCourses(Array.from(selectedCourseIds));
    // await loadCourses(user.id);
  };

  const handleBookmarkSelected = async () => {
    if (selectedCourseIds.size === 0 || !user?.id) return;

    const count = selectedCourseIds.size;
    const coursesToBookmark: string[] = Array.from(selectedCourseIds);

    // Bookmark each selected course - await each one sequentially
    for (const courseId of coursesToBookmark) {
      const course = displayCourses.find((c) => c.id === courseId);
      if (course && !isBookmarked(courseId)) {
        await toggleBookmark(user.id, course);
      }
    }

    toast.success(
      `Successfully bookmarked ${count} course${count > 1 ? 's' : ''}!`,
      {
        duration: 4000,
        position: 'top-center',
        style: {
          borderRadius: '12px',
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '2px solid #10b981',
          padding: '16px 24px',
          maxWidth: '600px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
      }
    );

    setSelectedCourseIds(new Set());
    setIsSelectMode(false);
  };

  const handleUnbookmarkSelected = async () => {
    if (selectedCourseIds.size === 0 || !user?.id) return;

    const count = selectedCourseIds.size;
    const coursesToUnbookmark: string[] = Array.from(selectedCourseIds);

    // Unbookmark each selected course - await each one sequentially
    for (const courseId of coursesToUnbookmark) {
      const course = displayCourses.find((c) => c.id === courseId);
      if (course) {
        await toggleBookmark(user.id, course);
      }
    }

    toast.success(
      `Successfully removed ${count} course${count > 1 ? 's' : ''} from bookmarks!`,
      {
        duration: 4000,
        position: 'top-center',
        style: {
          borderRadius: '12px',
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '2px solid #f97316',
          padding: '16px 24px',
          maxWidth: '600px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
          primary: '#f97316',
          secondary: '#fff',
        },
      }
    );

    setSelectedCourseIds(new Set());
    setIsSelectMode(false);
  };

  const handleCancelSelection = () => {
    setIsSelectMode(false);
    setSelectedCourseIds(new Set());
  };

  const isAllSelected = displayCourses.length > 0 && selectedCourseIds.size === displayCourses.length;

  // Check which selected courses are bookmarked
  const selectedBookmarkedCount = Array.from(selectedCourseIds).filter((courseId) =>
    isBookmarked(courseId)
  ).length;
  const allSelectedAreBookmarked = selectedBookmarkedCount === selectedCourseIds.size && selectedCourseIds.size > 0;
  const someSelectedAreBookmarked = selectedBookmarkedCount > 0 && selectedBookmarkedCount < selectedCourseIds.size;

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

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

      // Close modal and show success toast
      setIsGenerateModalOpen(false);
      setSelectedDomain('');
      setCustomDomain('');

      toast.success(
        `Successfully generated ${data.count} courses for ${domain}! Browse them in the All Courses tab and bookmark your favorites.`,
        {
          duration: 5000,
          position: 'top-center',
          style: {
            borderRadius: '12px',
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '2px solid #10b981',
            padding: '16px 24px',
            maxWidth: '600px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        }
      );

      // Reload courses to show new ones
      if (user?.id) {
        await loadCourses(user.id);
      }
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
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto">
      <Toaster
        position="top-center"
        toastOptions={{
          // Default options
          className: '',
          duration: 4000,
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            maxWidth: '600px',
          },
          // Success
          success: {
            style: {
              border: '2px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          // Error
          error: {
            style: {
              border: '2px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
            Course Recommendations
          </h1>
          <p className="text-text-muted text-lg">Discover and manage your learning journey</p>
        </div>
        <div className="flex items-center gap-3">
          {isSelectMode && (
            <>
              <Button
                onClick={handleCancelSelection}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                Cancel Selection
              </Button>
              <Button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </Button>
            </>
          )}
          {!isSelectMode && (
            <Button
              onClick={() => setIsSelectMode(true)}
              className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Select
            </Button>
          )}
          <Button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            Generate Courses
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-border pb-1">
        <div className="flex gap-2 bg-surface rounded-full p-1 border border-border shadow-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 font-semibold rounded-full transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-text-muted hover:text-text hover:bg-background'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab('bookmarked')}
            className={`px-6 py-2.5 font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
              activeTab === 'bookmarked'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-text-muted hover:text-text hover:bg-background'
            }`}
          >
            Bookmarked ({bookmarkedCourses.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Selection Badge */}
          {isSelectMode && selectedCourseIds.size > 0 && (
            <Badge variant="primary" className="px-3 py-1">
              {selectedCourseIds.size} selected
            </Badge>
          )}

          {/* Bookmark Selected Button - Show only when all selected are unbookmarked */}
          {isSelectMode && selectedCourseIds.size > 0 && selectedBookmarkedCount === 0 && (
            <Button
              size="sm"
              onClick={handleBookmarkSelected}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all"
            >
              <Bookmark className="w-4 h-4" />
              Bookmark
            </Button>
          )}

          {/* Unbookmark Selected Button - Show only when all selected are bookmarked */}
          {isSelectMode && allSelectedAreBookmarked && (
            <Button
              size="sm"
              onClick={handleUnbookmarkSelected}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all"
            >
              <Bookmark className="w-4 h-4" />
              Unbookmark
            </Button>
          )}

          {/* Delete Button - Show when there's a mix or always */}
          {isSelectMode && selectedCourseIds.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 hover:border-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}

          {/* Filters Button */}
          {!isSelectMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          )}
        </div>
      </div>


      {/* Filters */}
      {showFilters && (
        <Card className="border border-border shadow-md">
          <CardContent className="pt-5 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
        <Card className="border-2 border-dashed border-border">
          <CardContent className="pt-14 pb-14">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
                <GraduationCap className="w-16 h-16 text-primary-500 relative" />
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                {activeTab === 'bookmarked'
                  ? 'No bookmarked courses yet'
                  : 'No courses yet'}
              </h3>
              <p className="text-text-muted mb-6 max-w-md text-base">
                {activeTab === 'bookmarked'
                  ? 'Bookmark courses from the All Courses tab to see them here.'
                  : 'Generate AI-powered course recommendations to get started with your learning journey.'}
              </p>
              <Button
                onClick={() => setIsGenerateModalOpen(true)}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 shadow-md hover:shadow-lg transition-all duration-200"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayCourses.map((course) => {
            const bookmarked = isBookmarked(course.id);
            const isSelected = selectedCourseIds.has(course.id);

            return (
              <Card
                key={course.id}
                className={`group relative bg-white dark:bg-surface border border-border hover:border-primary-400 hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  isSelected ? 'ring-2 ring-primary-500 border-primary-500 shadow-lg' : ''
                }`}
              >
                {/* Completed Badge - Top Right Ribbon */}
                {course.completed && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </div>
                  </div>
                )}

                <CardContent className="p-5 flex flex-col h-full">
                  {/* Header: Checkbox, Title, Bookmark */}
                  <div className="flex items-start gap-2.5 mb-4">
                    {isSelectMode && (
                      <button
                        onClick={() => toggleCourseSelection(course.id)}
                        className="flex-shrink-0 p-0.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-all group/checkbox animate-in fade-in"
                        aria-label={isSelected ? 'Deselect course' : 'Select course'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-primary-500" />
                        ) : (
                          <Square className="w-5 h-5 text-text-muted group-hover/checkbox:text-primary-500 transition-colors" />
                        )}
                      </button>
                    )}

                    <h3 className={`font-semibold text-text line-clamp-2 flex-1 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${isSelectMode ? 'text-base' : 'text-lg'}`}>
                      {course.title}
                    </h3>

                    <button
                      onClick={() => user?.id && toggleBookmark(user.id, course)}
                      className="flex-shrink-0 p-0.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-all group/bookmark"
                      disabled={!user?.id}
                      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="w-5 h-5 text-primary-500" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-text-muted group-hover/bookmark:text-primary-500 transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {course.difficulty && (
                      <span
                        className={`text-sm font-semibold px-3.5 py-1 rounded-full ${
                          course.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : course.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                      </span>
                    )}
                    {course.category && (
                      <span className="text-sm font-semibold px-3.5 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                        {course.category}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {course.rating && (
                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => {
                          const rating = course.rating || 0;
                          const fullStars = Math.floor(rating);
                          const hasPartial = rating % 1 !== 0;
                          const isPartialStar = hasPartial && i === fullStars;
                          const partialFill = ((rating % 1) * 100).toFixed(0);

                          return (
                            <div key={i} className="relative">
                              <Star className="w-4.5 h-4.5 text-gray-300 dark:text-gray-600" />
                              {i < fullStars && (
                                <Star className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400 absolute top-0 left-0" />
                              )}
                              {isPartialStar && (
                                <div
                                  className="absolute top-0 left-0 overflow-hidden"
                                  style={{ width: `${partialFill}%` }}
                                >
                                  <Star className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-base font-bold text-text ml-1.5">{course.rating}</span>
                      <span className="text-sm text-text-muted">/ 5.0</span>
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Footer: Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center">
                      {!course.price || course.price === 0 ? (
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          Free
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <DollarSign className="w-5 h-5 text-text" />
                          <span className="text-lg font-bold text-text">{course.price}</span>
                        </div>
                      )}
                    </div>
                    <a
                      href={course.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!course.url || course.url === '#') {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Button
                        size="sm"
                        className="flex items-center gap-1.5 text-sm px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200 hover:shadow-md"
                        disabled={!course.url || course.url === '#'}
                      >
                        View Course
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

      {/* Pagination */}
      {!storeLoading && filteredCourses.length > 0 && totalPages > 1 && (
        <Card className="mt-6 border border-border shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page info */}
              <div className="text-sm font-medium text-text">
                Page <span className="text-primary-600 dark:text-primary-400 font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                <span className="text-text-muted ml-2">
                  ({startIndex + 1}-{Math.min(endIndex, filteredCourses.length)} of {filteredCourses.length})
                </span>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-400 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {getPageNumbers().map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      disabled={page === '...' || page === currentPage}
                      className={`
                        min-w-[38px] h-[38px] flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200
                        ${
                          page === currentPage
                            ? 'bg-primary-500 text-white shadow-md'
                            : page === '...'
                            ? 'text-text-muted cursor-default'
                            : 'text-text hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-border hover:border-primary-400'
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-400 transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile page numbers */}
              <div className="sm:hidden text-sm font-medium text-text">
                <span className="text-primary-600 dark:text-primary-400 font-bold">{currentPage}</span> / <span className="font-bold">{totalPages}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Selected Courses"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-red-900 dark:text-red-100 font-semibold mb-1">
                Are you sure you want to delete the selected courses?
              </p>
              <p className="text-red-700 dark:text-red-300">
                You are about to delete <strong>{selectedCourseIds.size}</strong> course
                {selectedCourseIds.size > 1 ? 's' : ''}. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete {selectedCourseIds.size} Course{selectedCourseIds.size > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </Modal>

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
