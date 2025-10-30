/**
 * @file db.ts
 * @description Database service layer for Appwrite TablesDB
 * @dependencies appwrite, @/lib/types
 */

import { tablesDB, DB_CONFIG, ID } from "./appwrite";
import type { Profile, Course, SkillPathway } from "./types";
import { Query } from "appwrite";

// Permission helper for user-owned rows
// Note: Using empty array means permissions inherit from collection settings
// If you need user-specific permissions, configure them in Appwrite Console
const getUserPermissions = (_userId: string) => [];

// =====================================
// USERPROFILES COLLECTION
// =====================================

export interface UserProfileRow {
  userId: string; // Size: 50 in Appwrite (supports longer IDs)
  bio: string; // Size: 2000, nullable
  education: string[]; // Array of JSON strings, Size: 10000, nullable
  skills: string[]; // Array of JSON strings, Size: 5000, nullable
  experience: string[]; // Array of JSON strings, Size: 10000, nullable
  documents: string; // Single JSON string containing all documents, Size: 1000000, nullable
  assessmentScores: string[]; // Array of JSON strings in Appwrite, Size: 500, nullable (FIXED: was string, now string[])
  dominantType: string; // Size: 50, nullable
  assessmentCompletedAt: string | null; // datetime, nullable
  completionPercentage: number; // integer, nullable
}

export const profileService = {
  /**
   * Create a new user profile
   */
  async create(userId: string, profile: Profile): Promise<UserProfileRow> {
    const rowData: Omit<UserProfileRow, "$id" | "$createdAt" | "$updatedAt"> = {
      userId,
      bio: profile.bio || "",
      // Convert complex objects to JSON strings for array storage
      education: (profile.education || []).map((e) => JSON.stringify(e)),
      skills: (profile.skills || []).map((s) => JSON.stringify(s)),
      experience: (profile.experience || []).map((e) => JSON.stringify(e)),
      // Documents: store ALL documents as a single JSON string
      documents: JSON.stringify(profile.documents || []),
      // Convert assessmentScores object to JSON string array (Appwrite schema requires array)
      assessmentScores: profile.assessmentScores
        ? [JSON.stringify(profile.assessmentScores)]
        : [],
      dominantType: profile.dominantType || "",
      assessmentCompletedAt: profile.assessmentCompletedAt || null,
      completionPercentage: profile.completionPercentage || 0,
    };

    console.log("📝 Creating profile with data:", rowData);

    const response = await tablesDB.createRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userProfiles,
      rowId: ID.unique(),
      data: rowData,
      permissions: getUserPermissions(userId),
    });

    return response as unknown as UserProfileRow;
  },

  /**
   * Get user profile by userId
   */
  async getByUserId(userId: string): Promise<Profile | null> {
    try {
      const response = await tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userProfiles,
        queries: [Query.equal("userId", userId)],
      });

      if (response.total === 0) {
        return null;
      }

      const row = response.rows[0] as any;
      return this.mapRowToProfile(row);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  async update(
    rowId: string,
    userId: string,
    updates: Partial<Profile>
  ): Promise<UserProfileRow> {
    const updateData: Partial<UserProfileRow> = {};

    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.education !== undefined)
      updateData.education = updates.education.map((e) => JSON.stringify(e));
    if (updates.skills !== undefined)
      updateData.skills = updates.skills.map((s) => JSON.stringify(s));
    if (updates.experience !== undefined)
      updateData.experience = updates.experience.map((e) => JSON.stringify(e));
    if (updates.documents !== undefined) {
      // Documents: store ALL documents as a single JSON string
      updateData.documents = JSON.stringify(updates.documents);
    }
    if (updates.assessmentScores !== undefined)
      updateData.assessmentScores = [JSON.stringify(updates.assessmentScores)];
    if (updates.dominantType !== undefined)
      updateData.dominantType = updates.dominantType;
    if (updates.assessmentCompletedAt !== undefined)
      updateData.assessmentCompletedAt = updates.assessmentCompletedAt;
    if (updates.completionPercentage !== undefined)
      updateData.completionPercentage = updates.completionPercentage;

    console.log("📝 Updating profile with data:", updateData);

    const response = await tablesDB.updateRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userProfiles,
      rowId,
      data: updateData,
    });

    return response as unknown as UserProfileRow;
  },

  /**
   * Map database row to Profile type
   */
  mapRowToProfile(row: any): Profile {
    // Helper to safely parse JSON strings from arrays
    const parseJsonArray = (arr: any[]): any[] => {
      if (!Array.isArray(arr)) return [];
      return arr.map((item) => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        }
        return item;
      });
    };

    // Helper to parse assessmentScores from array format (Appwrite schema)
    const parseAssessmentScores = (arr: any): any => {
      // Handle array format (correct Appwrite schema format)
      if (Array.isArray(arr) && arr.length > 0) {
        const firstItem = arr[0];
        if (typeof firstItem === "string") {
          try {
            return JSON.parse(firstItem);
          } catch {
            return {};
          }
        }
        return firstItem;
      }
      // Handle legacy string format for backward compatibility
      if (typeof arr === "string" && arr) {
        try {
          return JSON.parse(arr);
        } catch {
          return {};
        }
      }
      // Handle object format
      if (typeof arr === "object" && arr !== null && !Array.isArray(arr)) {
        return arr;
      }
      return {};
    };

    // Parse documents from single JSON string
    const parseDocuments = (docs: any): any[] => {
      if (typeof docs === 'string' && docs) {
        try {
          return JSON.parse(docs);
        } catch {
          return [];
        }
      }
      if (Array.isArray(docs)) {
        return docs;
      }
      return [];
    };

    return {
      userId: row.userId,
      bio: row.bio || "",
      education: parseJsonArray(row.education),
      skills: parseJsonArray(row.skills),
      experience: parseJsonArray(row.experience),
      documents: parseDocuments(row.documents),
      assessmentScores: parseAssessmentScores(row.assessmentScores),
      dominantType: row.dominantType || "",
      assessmentCompletedAt: row.assessmentCompletedAt || null,
      completionPercentage: row.completionPercentage || 0,
      $id: row.$id,
      $createdAt: row.$createdAt,
      $updatedAt: row.$updatedAt,
    };
  },
};

// =====================================
// USER_COURSES COLLECTION
// =====================================

export interface UserCourseRow {
  userId: string; // Size: 36 in Appwrite, required
  courseId: string; // Size: 36 in Appwrite, required
  title: string; // Size: 300, required
  platform: string; // Size: 1000, nullable
  difficulty: string; // Size: 20, nullable
  price: number; // double, Min: 0, nullable
  rating: number; // double, nullable
  url: string; // Size: 1000, nullable
  category: string; // Size: 100, nullable
  bookmarked: boolean; // default: false
  completed: boolean; // default: false
}

export const coursesService = {
  /**
   * Add a course for a user
   */
  async add(userId: string, course: Course, bookmarked: boolean = false): Promise<UserCourseRow> {
    const rowData: Omit<UserCourseRow, "$id" | "$createdAt" | "$updatedAt"> = {
      userId,
      courseId: course.id,
      title: course.title,
      platform: course.platform,
      difficulty: course.difficulty,
      price: course.price,
      rating: course.rating,
      url: course.url,
      category: course.category || "",
      bookmarked,
      completed: false,
    };

    const response = await tablesDB.createRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userCourses,
      rowId: ID.unique(),
      data: rowData,
      permissions: getUserPermissions(userId),
    });

    return response as unknown as UserCourseRow;
  },

  /**
   * Get all courses for a user
   */
  async getByUserId(userId: string): Promise<Course[]> {
    try {
      const response = await tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userCourses,
        queries: [Query.equal("userId", userId)],
      });

      return (response.rows as any[]).map((row) => this.mapRowToCourse(row));
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  /**
   * Get bookmarked courses for a user
   */
  async getBookmarked(userId: string): Promise<Course[]> {
    try {
      const response = await tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userCourses,
        queries: [
          Query.equal("userId", userId),
          Query.equal("bookmarked", true),
        ],
      });

      return (response.rows as any[]).map((row) => this.mapRowToCourse(row));
    } catch (error) {
      console.error("Error fetching bookmarked courses:", error);
      return [];
    }
  },

  /**
   * Update course
   */
  async update(
    rowId: string,
    updates: Partial<Omit<UserCourseRow, "$id" | "$createdAt" | "$updatedAt">>
  ): Promise<UserCourseRow> {
    const response = await tablesDB.updateRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userCourses,
      rowId,
      data: updates,
    });

    return response as unknown as UserCourseRow;
  },

  /**
   * Delete a course
   */
  async delete(rowId: string): Promise<void> {
    await tablesDB.deleteRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userCourses,
      rowId,
    });
  },

  /**
   * Find course by userId and courseId
   */
  async findByCourseId(
    userId: string,
    courseId: string
  ): Promise<(UserCourseRow & { $id: string }) | null> {
    try {
      const response = await tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userCourses,
        queries: [
          Query.equal("userId", userId),
          Query.equal("courseId", courseId),
        ],
      });

      if (response.total === 0) {
        return null;
      }

      return response.rows[0] as any;
    } catch (error) {
      console.error("Error finding course:", error);
      return null;
    }
  },

  /**
   * Map database row to Course type
   */
  mapRowToCourse(row: any): Course & { bookmarked?: boolean } {
    return {
      id: row.courseId,
      title: row.title,
      platform: row.platform,
      difficulty: row.difficulty,
      price: row.price,
      rating: row.rating,
      url: row.url,
      category: row.category || "",
      bookmarked: row.bookmarked !== false,
      $dbId: row.$id, // Store the database row ID for updates/deletes
      $createdAt: row.$createdAt, // Store creation timestamp for sorting
    };
  },
};

// =====================================
// USER_PATHWAYS COLLECTION
// =====================================

export interface UserPathwayRow {
  userId: string; // Size: 36, required
  pathwayId: string; // Size: 50, required
  name: string; // Size: 200, required
  category: string; // Size: 100, required
  level: string; // Size: 20, required
  completed: boolean; // default: false
  completedAt: string | null; // datetime, nullable
  estimatedTime: string; // Size: 50, nullable
}

export const pathwaysService = {
  /**
   * Add a pathway for a user
   */
  async add(userId: string, pathway: SkillPathway): Promise<UserPathwayRow> {
    const rowData: Omit<UserPathwayRow, "$id" | "$createdAt" | "$updatedAt"> = {
      userId,
      pathwayId: pathway.id,
      name: pathway.name,
      category: pathway.category,
      level: pathway.level,
      completed: false,
      completedAt: null,
      estimatedTime: pathway.estimatedTime || "",
    };

    const response = await tablesDB.createRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userPathways,
      rowId: ID.unique(),
      data: rowData,
      permissions: getUserPermissions(userId),
    });

    return response as unknown as UserPathwayRow;
  },

  /**
   * Get all pathways for a user
   */
  async getByUserId(userId: string): Promise<any[]> {
    try {
      const response = await tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userPathways,
        queries: [Query.equal("userId", userId)],
      });

      return response.rows as any[];
    } catch (error) {
      console.error("Error fetching pathways:", error);
      return [];
    }
  },

  /**
   * Update pathway
   */
  async update(
    rowId: string,
    updates: Partial<Omit<UserPathwayRow, "$id" | "$createdAt" | "$updatedAt">>
  ): Promise<UserPathwayRow> {
    const response = await tablesDB.updateRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userPathways,
      rowId,
      data: updates,
    });

    return response as unknown as UserPathwayRow;
  },

  /**
   * Delete a pathway
   */
  async delete(rowId: string): Promise<void> {
    await tablesDB.deleteRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userPathways,
      rowId,
    });
  },

  /**
   * Find pathway by userId and pathwayId
   */
  async findByPathwayId(
    userId: string,
    pathwayId: string
  ): Promise<(UserPathwayRow & { $id: string }) | null> {
    try {
      const response = await tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userPathways,
        queries: [
          Query.equal("userId", userId),
          Query.equal("pathwayId", pathwayId),
        ],
      });

      if (response.total === 0) {
        return null;
      }

      return response.rows[0] as any;
    } catch (error) {
      console.error("Error finding pathway:", error);
      return null;
    }
  },
};
