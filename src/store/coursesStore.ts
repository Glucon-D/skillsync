/**
 * @file coursesStore.ts
 * @description Courses and bookmarks state management with Zustand and Appwrite
 * @dependencies zustand, @/lib/types, @/lib/constants, @/lib/db
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course, SyncOptions } from '@/lib/types';
import { STORAGE_KEYS, LOCALDB_KEYS } from '@/lib/constants';
import { coursesService } from '@/lib/db';
import { localDB } from '@/lib/localDB';

interface CoursesState {
  allCourses: Course[];
  bookmarkedCourses: Course[];
  isLoading: boolean;
  error: string | null;
}

interface CoursesActions {
  toggleBookmark: (userId: string, course: Course) => Promise<void>;
  isBookmarked: (courseId: string) => boolean;
  getBookmarkedCourses: () => Course[];
  getAllCourses: () => Course[];
  loadCourses: (userId: string) => Promise<void>;
  markCompleted: (courseId: string, completed: boolean) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadFromLocalDB: () => void;
  syncWithAppwrite: (userId: string, options?: SyncOptions) => Promise<void>;
}

export const useCoursesStore = create<CoursesState & CoursesActions>()(
  persist(
    (set, get) => ({
      allCourses: [],
      bookmarkedCourses: [],
      isLoading: false,
      error: null,

      toggleBookmark: async (userId: string, course: Course) => {
        const { bookmarkedCourses, allCourses } = get();
        const existingCourse = bookmarkedCourses.find((c) => c.id === course.id);

        if (existingCourse) {
          // Unbookmark - update bookmarked field in database
          if (existingCourse.$dbId) {
            try {
              await coursesService.update(existingCourse.$dbId, { bookmarked: false });
              set({
                bookmarkedCourses: bookmarkedCourses.filter((c) => c.id !== course.id),
                allCourses: allCourses.map((c) =>
                  c.id === course.id ? { ...c } : c
                ),
              });
            } catch (error) {
              console.error('Failed to update course:', error);
              set({ error: 'Failed to remove bookmark' });
            }
          }
        } else {
          // Bookmark course
          const existingInAll = allCourses.find((c) => c.id === course.id);
          if (existingInAll?.$dbId) {
            // Course exists, just update bookmark status
            try {
              await coursesService.update(existingInAll.$dbId, { bookmarked: true });
              set({
                bookmarkedCourses: [...bookmarkedCourses, existingInAll],
              });
            } catch (error) {
              console.error('Failed to update course:', error);
              set({ error: 'Failed to add bookmark' });
            }
          } else {
            // Course doesn't exist, add it with bookmarked=true
            try {
              const newCourse = await coursesService.add(userId, course, true);
              const mappedCourse = coursesService.mapRowToCourse(newCourse);
              set({
                allCourses: [...allCourses, mappedCourse],
                bookmarkedCourses: [...bookmarkedCourses, mappedCourse],
              });
            } catch (error) {
              console.error('Failed to add course:', error);
              set({ error: 'Failed to add bookmark' });
            }
          }
        }
      },

      isBookmarked: (courseId: string) => {
        return get().bookmarkedCourses.some((c) => c.id === courseId);
      },

      getBookmarkedCourses: () => {
        return get().bookmarkedCourses;
      },

      getAllCourses: () => {
        return get().allCourses;
      },

      loadCourses: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const allCourses = await coursesService.getByUserId(userId);
          const bookmarked = allCourses.filter((c: any) => c.bookmarked !== false);
          set({
            allCourses,
            bookmarkedCourses: bookmarked,
            isLoading: false
          });
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

      loadFromLocalDB: () => {
        console.log('[CoursesStore] 📂 Loading courses from LocalDB...');
        
        const courses = localDB.getAll<Course & { bookmarked?: boolean }>(LOCALDB_KEYS.COURSES);
        
        if (courses.length > 0) {
          const bookmarked = courses.filter(c => c.bookmarked !== false);
          console.log(`[CoursesStore] ✅ Loaded ${courses.length} courses (${bookmarked.length} bookmarked)`);
          set({
            allCourses: courses,
            bookmarkedCourses: bookmarked,
            error: null,
          });
        } else {
          console.log('[CoursesStore] ⚠️ No courses found in LocalDB');
        }
      },

      syncWithAppwrite: async (userId: string, options?: SyncOptions) => {
        const { silentSync = true } = options || {};
        
        console.log(`[CoursesStore] 🔄 Starting Appwrite sync for user: ${userId}`);
        
        if (!silentSync) {
          set({ isLoading: true, error: null });
        }

        try {
          const remoteCourses = await coursesService.getByUserId(userId);
          
          console.log(`[CoursesStore] 📥 Received ${remoteCourses.length} courses from Appwrite`);
          
          const bookmarked = remoteCourses.filter((c: Course & { bookmarked?: boolean }) => c.bookmarked !== false);
          
          set({
            allCourses: remoteCourses,
            bookmarkedCourses: bookmarked,
          });
          
          localDB.setItems(LOCALDB_KEYS.COURSES, remoteCourses);
          console.log('[CoursesStore] ✅ Sync complete - Updated Zustand & LocalDB');
          
          if (!silentSync) {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('[CoursesStore] ❌ Appwrite sync failed:', error);
          set({ 
            error: 'Failed to sync courses',
            isLoading: false 
          });
        }
      },
    }),
    {
      name: STORAGE_KEYS.BOOKMARKED_COURSES,
    }
  )
);
