/**
 * @file coursesStore.ts
 * @description Courses and bookmarks state management with Zustand
 * @dependencies zustand, @/lib/types, @/lib/constants
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface CoursesState {
  bookmarkedCourses: string[];
}

interface CoursesActions {
  toggleBookmark: (courseId: string) => void;
  isBookmarked: (courseId: string) => boolean;
  getBookmarkedCourses: (allCourses: Course[]) => Course[];
}

export const useCoursesStore = create<CoursesState & CoursesActions>()(
  persist(
    (set, get) => ({
      bookmarkedCourses: [],

      toggleBookmark: (courseId: string) => {
        const bookmarkedCourses = get().bookmarkedCourses;
        if (bookmarkedCourses.includes(courseId)) {
          set({ bookmarkedCourses: bookmarkedCourses.filter(id => id !== courseId) });
        } else {
          set({ bookmarkedCourses: [...bookmarkedCourses, courseId] });
        }
      },

      isBookmarked: (courseId: string) => {
        return get().bookmarkedCourses.includes(courseId);
      },

      getBookmarkedCourses: (allCourses: Course[]) => {
        const bookmarkedCourses = get().bookmarkedCourses;
        return allCourses.filter(course => bookmarkedCourses.includes(course.id));
      },
    }),
    {
      name: STORAGE_KEYS.BOOKMARKED_COURSES,
    }
  )
);
