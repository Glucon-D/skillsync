/**
 * @file (dashboard)/careers/page.tsx
 * @description Job listings page with search and filters
 * @dependencies react, lucide-react, @/data/jobs, @/components/ui
 */

'use client';

import { useState, useMemo } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search, Building2, Star, ExternalLink } from 'lucide-react';
import { JobsData } from '@/data/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return JobsData.jobs.filter((job) => {
      const matchesSearch =
        searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesDepartment =
        selectedDepartment === 'all' ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(selectedDepartment.toLowerCase())
        );

      const matchesWorkMode =
        selectedWorkMode === 'all' || job.workMode === selectedWorkMode;

      return matchesSearch && matchesDepartment && matchesWorkMode;
    });
  }, [searchQuery, selectedDepartment, selectedWorkMode]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Job Opportunities</h1>
        <p className="text-text-muted">
          {JobsData.totalJobs.toLocaleString()} jobs available • Updated{' '}
          {JobsData.lastUpdated}
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Departments</option>
              {JobsData.filters.departments.map((dept) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name} ({dept.count})
                </option>
              ))}
            </select>

            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Work Modes</option>
              {JobsData.filters.workModes.map((mode) => (
                <option key={mode.mode} value={mode.mode}>
                  {mode.mode} ({mode.count})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-text-muted">
            Showing {filteredJobs.length} of {JobsData.jobs.length} jobs
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.slice(0, 50).map((job) => (
          <Card key={job.id} hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text mb-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-text-muted mb-3">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{job.company.name}</span>
                    {job.company.rating && (
                      <>
                        <span className="text-text-muted">•</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{job.company.rating}</span>
                        {job.company.reviewCount && (
                          <span className="text-sm">
                            ({job.company.reviewCount} reviews)
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Briefcase className="w-4 h-4" />
                  <span>
                    {job.experience.min}-{job.experience.max} {job.experience.unit}
                  </span>
                </div>

                {job.salary && (
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>
                      {job.salary.min / 100000}-{job.salary.max / 100000} LPA
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {Array.isArray(job.location)
                      ? job.location.join(', ')
                      : job.location}
                  </span>
                </div>
              </div>

              {job.badges && job.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.badges.map((badge, idx) => (
                    <Badge key={idx} variant="default" size="sm">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm font-medium text-text mb-2">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 8).map((skill, idx) => (
                    <Badge key={idx} variant="primary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 8 && (
                    <Badge variant="default" size="sm">
                      +{job.skills.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Clock className="w-4 h-4" />
                  <span>Posted {job.postedDate}</span>
                  {job.workMode && (
                    <>
                      <span>•</span>
                      <span>{job.workMode}</span>
                    </>
                  )}
                  {job.jobType && (
                    <>
                      <span>•</span>
                      <span>{job.jobType}</span>
                    </>
                  )}
                </div>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length > 50 && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-text-muted mb-4">
              Showing 50 of {filteredJobs.length} jobs
            </p>
            <Button variant="outline">Load More Jobs</Button>
          </CardContent>
        </Card>
      )}

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">
              No jobs found
            </h3>
            <p className="text-text-muted">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
