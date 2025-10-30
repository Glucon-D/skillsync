/**
 * @file coursesStore.ts
 * @description Courses and bookmarks state management with Zustand and Appwrite
 * @dependencies zustand, @/lib/types, @/lib/constants, @/lib/db
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { coursesService } from '@/lib/db';

interface CoursesState {
  bookmarkedCourses: Course[];
  isLoading: boolean;
  error: string | null;
}

interface CoursesActions {
  toggleBookmark: (userId: string, course: Course) => Promise<void>;
  isBookmarked: (courseId: string) => boolean;
  getBookmarkedCourses: () => Course[];
  loadCourses: (userId: string) => Promise<void>;
  markCompleted: (courseId: string, completed: boolean) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCoursesStore = create<CoursesState & CoursesActions>()(
  persist(
    (set, get) => ({
      bookmarkedCourses: [],
      isLoading: false,
      error: null,

      toggleBookmark: async (userId: string, course: Course) => {
        const bookmarkedCourses = get().bookmarkedCourses;
        const existingCourse = bookmarkedCourses.find((c) => c.id === course.id);

        if (existingCourse) {
          // Remove bookmark
          set({
            bookmarkedCourses: bookmarkedCourses.filter((c) => c.id !== course.id),
          });

          // Delete from database
          if (existingCourse.$dbId) {
            try {
              await coursesService.delete(existingCourse.$dbId);
            } catch (error) {
              console.error('Failed to delete course:', error);
              set({ error: 'Failed to remove bookmark' });
            }
          }
        } else {
          // Add bookmark
          try {
            const newCourse = await coursesService.add(userId, course);
            const mappedCourse = coursesService.mapRowToCourse(newCourse);
            set({
              bookmarkedCourses: [...bookmarkedCourses, mappedCourse],
            });
          } catch (error) {
            console.error('Failed to add course:', error);
            set({ error: 'Failed to add bookmark' });
          }
        }
      },

      isBookmarked: (courseId: string) => {
        return get().bookmarkedCourses.some((c) => c.id === courseId);
      },

      getBookmarkedCourses: () => {
        return get().bookmarkedCourses;
      },

      loadCourses: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const courses = await coursesService.getBookmarked(userId);
          set({ bookmarkedCourses: courses, isLoading: false });
        } catch (error) {
          console.error('Failed to load courses:', error);
          set({ error: 'Failed to load courses', isLoading: false });
        }
      },

      markCompleted: async (courseId: string, completed: boolean) => {
        const bookmarkedCourses = get().bookmarkedCourses;
        const course = bookmarkedCourses.find((c) => c.id === courseId);

        if (course && course.$dbId) {
          try {
            await coursesService.update(course.$dbId, { completed });
            set({
              bookmarkedCourses: bookmarkedCourses.map((c) =>
                c.id === courseId ? { ...c, completed } : c
              ),
            });
          } catch (error) {
            console.error('Failed to mark course as completed:', error);
            set({ error: 'Failed to update course' });
          }
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: STORAGE_KEYS.BOOKMARKED_COURSES,
    }
  )
);
