/**
 * @file DataLoader.tsx
 * @description Component that loads all user data from the database on authentication
 * @dependencies react, @/hooks/useAuth, @/store
 */

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfileStore } from '@/store/profileStore';
import { useCoursesStore } from '@/store/coursesStore';
import { usePathwaysStore } from '@/store/pathwaysStore';

/**
 * DataLoader component
 *
 * This component automatically loads all user data from Appwrite when the user is authenticated.
 * It should be placed high in the component tree (e.g., in a layout) to ensure data is available
 * throughout the application.
 *
 * Data loaded:
 * - User profile (education, skills, experience, assessment scores)
 * - Bookmarked courses
 * - Learning pathway progress
 */
export function DataLoader() {
  const { user } = useAuth();
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const loadCourses = useCoursesStore((state) => state.loadCourses);
  const loadPathways = usePathwaysStore((state) => state.loadPathways);

  useEffect(() => {
    if (user?.id) {
      // Load all user data from the database
      loadProfile(user.id);
      loadCourses(user.id);
      loadPathways(user.id);
    }
  }, [user?.id, loadProfile, loadCourses, loadPathways]);

  // This component doesn't render anything
  return null;
}
