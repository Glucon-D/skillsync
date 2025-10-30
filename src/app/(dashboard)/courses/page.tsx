/**
 * @file (dashboard)/courses/page.tsx
 * @description Courses recommendation page
 * @dependencies react, lucide-react, @/store/coursesStore, @/store/authStore, @/data/sampleCourses, @/components/ui
 */

'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck, Star, Clock, DollarSign } from 'lucide-react';
import { useCoursesStore } from '@/store/coursesStore';
import { useAuthStore } from '@/store/authStore';
import { sampleCourses } from '@/data/sampleCourses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';

export default function CoursesPage() {
  const user = useAuthStore((state) => state.user);
  const { toggleBookmark, isBookmarked } = useCoursesStore();
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const filteredCourses = sampleCourses.filter((course) => {
    if (difficultyFilter !== 'all' && course.difficulty !== difficultyFilter) return false;
    if (platformFilter !== 'all' && course.platform !== platformFilter) return false;
    return true;
  });

  const platforms = Array.from(new Set(sampleCourses.map(c => c.platform)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Course Recommendations</h1>
        <p className="text-text-muted">Discover courses to enhance your skills</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const bookmarked = isBookmarked(course.id);
          
          return (
            <Card key={course.id} hover>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <button
                    onClick={() => user?.id && toggleBookmark(user.id, course)}
                    className="flex-shrink-0"
                    disabled={!user?.id}
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-primary-500" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-text-muted" />
                    )}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-text-muted">{course.instructor}</p>
                
                <div className="flex items-center gap-2">
                  <Badge>{course.platform}</Badge>
                  <Badge variant={
                    course.difficulty === 'beginner' ? 'default' :
                    course.difficulty === 'intermediate' ? 'warning' : 'error'
                  }>
                    {course.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-text-muted">
                    <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                    {course.rating}
                  </div>
                  <div className="flex items-center text-text-muted">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center text-lg font-bold text-text">
                    <DollarSign className="w-5 h-5" />
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </div>
                  <Button size="sm">View Course</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
