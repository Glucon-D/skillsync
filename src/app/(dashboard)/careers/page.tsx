/**
 * @file (dashboard)/careers/page.tsx
 * @description Modern job listings page with enhanced UI and comprehensive filtering
 * @dependencies react, lucide-react, @/data/jobs, @/components/ui
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Building2,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Sparkles,
} from 'lucide-react';
import { JobsData } from '@/data/jobs';
import type { JobListing } from '@/data/jobs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const JOBS_PER_PAGE = 8;

// TypeScript interfaces for state
interface FilterState {
  searchQuery: string;
  department: string;
  salaryRange: string;
  workMode: string;
  companyType: string;
}

export default function CareersPage() {
  // State management with TypeScript types
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: 'all',
    salaryRange: 'all',
    workMode: 'all',
    companyType: 'all',
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Update individual filter
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      department: 'all',
      salaryRange: 'all',
      workMode: 'all',
      companyType: 'all',
    });
  };

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);

    return JobsData.jobs.filter((job: JobListing) => {
      // Search filter (job title or company name)
      const matchesSearch =
        filters.searchQuery === '' ||
        job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Department filter
      const matchesDepartment =
        filters.department === 'all' ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(filters.department.toLowerCase())
        );

      // Work mode filter
      const matchesWorkMode =
        filters.workMode === 'all' || job.workMode === filters.workMode;

      // Salary range filter
      const matchesSalary = (() => {
        if (filters.salaryRange === 'all' || !job.salary) return true;

        const avgSalary = (job.salary.min + job.salary.max) / 2;

        switch (filters.salaryRange) {
          case '0-3 Lakhs':
            return avgSalary <= 300000;
          case '3-6 Lakhs':
            return avgSalary > 300000 && avgSalary <= 600000;
          case '6-10 Lakhs':
            return avgSalary > 600000 && avgSalary <= 1000000;
          case '10-15 Lakhs':
            return avgSalary > 1000000 && avgSalary <= 1500000;
          default:
            return true;
        }
      })();

      // Company type filter (simplified - you can enhance this based on your data)
      const matchesCompanyType = filters.companyType === 'all';

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesWorkMode &&
        matchesSalary &&
        matchesCompanyType
      );
    });
  }, [filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

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

  // Check if any filters are active
  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.department !== 'all' ||
    filters.salaryRange !== 'all' ||
    filters.workMode !== 'all' ||
    filters.companyType !== 'all';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-surface border-b border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-text mb-2 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Job Opportunities
              </h1>
              <div className="flex items-center gap-2 text-text-muted">
                <Sparkles className="w-4 h-4" />
                <p className="text-sm font-medium">
                  {JobsData.totalJobs.toLocaleString()} jobs available • Updated{' '}
                  {JobsData.lastUpdated}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0 lg:order-1">
            {/* Job Listings Grid */}
            {paginatedJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {paginatedJobs.map((job: JobListing) => (
                  <Card
                    key={job.id}
                    className="bg-white dark:bg-surface hover:shadow-lg transition-all duration-200 rounded-xl border border-border hover:border-primary-500/50 group"
                  >
                    <CardContent className="p-6">
                      {/* Header: Title and Logo */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-lg font-semibold text-text mb-2 group-hover:text-primary-500 transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
                            <span className="font-medium text-text">{job.company.name}</span>
                            {job.company.rating && (
                              <>
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                <span className="font-medium">{job.company.rating}</span>
                                {job.company.reviewCount && (
                                  <span className="text-xs">
                                    | {job.company.reviewCount.toLocaleString()} Reviews
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        {/* Company Logo */}
                        {job.company.logo && (
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border bg-white p-1">
                            <Image
                              src={job.company.logo}
                              alt={job.company.name}
                              width={64}
                              height={64}
                              className="object-contain w-full h-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Info Row: Experience, Salary, Location */}
                      <div className="flex items-center gap-4 text-sm text-text-muted mb-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 flex-shrink-0" />
                          <span>{job.experience.min}-{job.experience.max} Yrs</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 flex-shrink-0" />
                            <span>{job.salary.min / 100000}-{job.salary.max / 100000} LPA</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {Array.isArray(job.location) ? job.location.join(', ') : job.location}
                          </span>
                        </div>
                      </div>

                      {/* Description/Badges */}
                      {job.badges && job.badges.length > 0 && (
                        <div className="flex items-start gap-2 text-sm text-text-muted mb-3">
                          <span className="flex-shrink-0 mt-0.5">•</span>
                          <p className="line-clamp-2">
                            {job.badges.join(' . ')}
                          </p>
                        </div>
                      )}

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5 text-sm">
                          {job.skills.slice(0, 8).map((skill, idx) => (
                            <span key={idx} className="text-primary-600 dark:text-primary-400">
                              {skill}
                              {idx < Math.min(job.skills.length, 8) - 1 && (
                                <span className="text-text-muted ml-1.5">•</span>
                              )}
                            </span>
                          ))}
                          {job.skills.length > 8 && (
                            <span className="text-text-muted">+{job.skills.length - 8} more</span>
                          )}
                        </div>
                      </div>

                      {/* Footer: Posted Date and Apply Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span>{job.postedDate}</span>
                          {job.workMode && (
                            <>
                              <span>•</span>
                              <span>{job.workMode}</span>
                            </>
                          )}
                        </div>
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg transition-all duration-200 hover:shadow-md gap-2"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* No Results */
              <Card className="shadow-lg">
                <CardContent className="py-20 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <Briefcase className="w-10 h-10 text-primary-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-3">No jobs found</h3>
                  <p className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
                    We couldn't find any jobs matching your criteria. Try adjusting your
                    filters or search query.
                  </p>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {filteredJobs.length > 0 && totalPages > 1 && (
              <Card className="mt-8 shadow-lg">
                <CardContent className="py-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page info */}
                    <div className="text-sm font-semibold text-text">
                      Page <span className="text-primary-600 dark:text-primary-400">{currentPage}</span> of {totalPages}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center gap-2">
                      {/* Previous button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      {/* Page numbers */}
                      <div className="hidden sm:flex items-center gap-2">
                        {getPageNumbers().map((page, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              typeof page === 'number' && setCurrentPage(page)
                            }
                            disabled={page === '...' || page === currentPage}
                            className={`
                              px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                              ${
                                page === currentPage
                                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md scale-110'
                                  : page === '...'
                                  ? 'text-text-muted cursor-default'
                                  : 'text-text hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-border hover:border-primary-500'
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
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Mobile page numbers */}
                    <div className="sm:hidden text-sm font-semibold text-text">
                      <span className="text-primary-600 dark:text-primary-400">{currentPage}</span> / {totalPages}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>

          {/* Sidebar Filters - Right Side */}
          <aside
            className={`
              lg:block lg:w-80 flex-shrink-0 lg:order-2
              ${showMobileFilters ? 'block' : 'hidden'}
            `}
          >
            <div className="lg:sticky lg:top-6">
              <Card className="shadow-lg border-border/50 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-text flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary-500" />
                      Filters
                    </h2>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1 transition-all duration-200 hover:scale-105"
                      >
                        <X className="w-4 h-4" />
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-semibold text-text mb-3">
                        Search Jobs
                      </label>
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-500 transition-colors duration-200" />
                        <Input
                          placeholder="Job title or company..."
                          value={filters.searchQuery}
                          onChange={(e) => updateFilter('searchQuery', e.target.value)}
                          className="pl-11 pr-4 py-2.5 rounded-full border-2 border-border focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Department Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-text mb-3">
                        Department
                      </label>
                      <select
                        value={filters.department}
                        onChange={(e) => updateFilter('department', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-surface text-text focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 cursor-pointer hover:border-primary-400"
                      >
                        <option value="all">All Departments</option>
                        {JobsData.filters.departments.map((dept) => (
                          <option key={dept.name} value={dept.name}>
                            {dept.name} ({dept.count})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Salary Range Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-text mb-3">
                        Salary Range
                      </label>
                      <select
                        value={filters.salaryRange}
                        onChange={(e) => updateFilter('salaryRange', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-surface text-text focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 cursor-pointer hover:border-primary-400"
                      >
                        <option value="all">All Salaries</option>
                        {JobsData.filters.salary.map((range) => (
                          <option key={range.range} value={range.range}>
                            {range.range} ({range.count})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Work Mode Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-text mb-3">
                        Work Mode
                      </label>
                      <select
                        value={filters.workMode}
                        onChange={(e) => updateFilter('workMode', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-surface text-text focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 cursor-pointer hover:border-primary-400"
                      >
                        <option value="all">All Work Modes</option>
                        {JobsData.filters.workModes.map((mode) => (
                          <option key={mode.mode} value={mode.mode}>
                            {mode.mode} ({mode.count})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Company Type Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-text mb-3">
                        Company Type
                      </label>
                      <select
                        value={filters.companyType}
                        onChange={(e) => updateFilter('companyType', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-surface text-text focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 cursor-pointer hover:border-primary-400"
                      >
                        <option value="all">All Company Types</option>
                        {JobsData.filters.companyTypes.map((type) => (
                          <option key={type.type} value={type.type}>
                            {type.type} ({type.count})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Results Summary */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-text">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of{' '}
                        <span className="text-primary-600 dark:text-primary-400">
                          {filteredJobs.length}
                        </span>{' '}
                        jobs
                      </p>
                      {filteredJobs.length !== JobsData.jobs.length && (
                        <p className="text-xs text-text-muted mt-1">
                          Filtered from {JobsData.jobs.length} total jobs
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
