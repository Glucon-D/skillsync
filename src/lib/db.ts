/**
 * @file db.ts
 * @description Database service layer for Appwrite TablesDB
 * @dependencies appwrite, @/lib/types
 */

import { tablesDB, DB_CONFIG, ID } from "./appwrite";
import type { Profile, Course, GeneratedPathwayResponse, StoredAIPathway } from "./types";
import { Query } from "appwrite";

// Permission helper for user-owned rows
const getUserPermissions = (userId: string) => [
  `read("user:${userId}")`,
  `update("user:${userId}")`,
  `delete("user:${userId}")`,
];

// =====================================
// USERPROFILES COLLECTION
// =====================================

export interface UserProfileRow {
  userId: string; // Size: 50 in Appwrite (supports longer IDs)
  bio: string; // Size: 2000, nullable
  education: string[]; // Array of JSON strings, Size: 10000, nullable
  skills: string[]; // Array of JSON strings, Size: 5000, nullable
  experience: string[]; // Array of JSON strings, Size: 10000, nullable
  documents: string[]; // Array of strings (URLs), Size: 2000, nullable
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
      documents: profile.documents || [],
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
    if (updates.documents !== undefined)
      updateData.documents = updates.documents;
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

    return {
      userId: row.userId,
      bio: row.bio || "",
      education: parseJsonArray(row.education),
      skills: parseJsonArray(row.skills),
      experience: parseJsonArray(row.experience),
      documents: Array.isArray(row.documents) ? row.documents : [],
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
  thumbnail: string; // Size: 500, nullable
  url: string; // Size: 1000, nullable
  category: string; // Size: 100, nullable
  bookmarked: boolean; // default: false
  completed: boolean; // default: false
}

export const coursesService = {
  /**
   * Add a course for a user
   */
  async add(userId: string, course: Course): Promise<UserCourseRow> {
    const rowData: Omit<UserCourseRow, "$id" | "$createdAt" | "$updatedAt"> = {
      userId,
      courseId: course.id,
      title: course.title,
      platform: course.platform,
      difficulty: course.difficulty,
      price: course.price,
      rating: course.rating,
      thumbnail: course.thumbnail || "",
      url: course.url,
      category: course.category || "",
      bookmarked: true,
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
  mapRowToCourse(row: any): Course {
    return {
      id: row.courseId,
      title: row.title,
      platform: row.platform,
      difficulty: row.difficulty,
      price: row.price,
      rating: row.rating,
      thumbnail: row.thumbnail || "",
      url: row.url,
      category: row.category || "",
      $dbId: row.$id, // Store the database row ID for updates/deletes
    };
  },
};


// =====================================
// AI PATHWAYS COLLECTION (EXTENDED USER_PATHWAYS)
// =====================================

export interface AIPathwayRow {
  userId: string;
  pathwayId: string; // unique ID for this AI pathway
  name: string; // pathway_title
  category: string; // e.g., "AI-Generated", "Custom", "Recommended"
  level: string; // "beginner", "intermediate", "advanced"
  completed: boolean;
  completedAt: string | null;
  estimatedTime: string; // estimatedDuration
  // Extended fields for AI pathways
  description?: string; // pathway description
  stepsData?: string[]; // Array of JSON strings for steps (Appwrite array format)
  resourcesData?: string[]; // Array of JSON strings for resources (Appwrite array format)
  isCustom?: boolean; // true if user requested, false if AI recommended
}

export const aiPathwaysService = {
  /**
   * Save AI-generated pathway to database
   */
  async saveAIPathway(
    userId: string,
    pathwayData: GeneratedPathwayResponse,
    isCustom: boolean = false
  ): Promise<AIPathwayRow> {
    const pathwayId = `ai-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const rowData: Omit<AIPathwayRow, "$id" | "$createdAt" | "$updatedAt"> = {
      userId,
      pathwayId,
      name: pathwayData.pathway_title,
      category: isCustom ? "Custom Skill" : "AI Recommended",
      level: "intermediate", // Default level, can be determined from steps
      completed: false,
      completedAt: null,
      estimatedTime: pathwayData.estimatedDuration || "12 months",
      description: pathwayData.description || "",
      // Store steps as array of JSON strings (each step is a separate string)
      stepsData: pathwayData.steps.map((step) => JSON.stringify(step)),
      // Store resources as array of JSON strings (each resource is a separate string)
      resourcesData: (pathwayData.resources || []).map((resource) => JSON.stringify(resource)),
      isCustom,
    };

    const response = await tablesDB.createRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userPathways,
      rowId: ID.unique(),
      data: rowData,
      permissions: getUserPermissions(userId),
    });

    return response as unknown as AIPathwayRow;
  },

  /**
   * Get all AI pathways for a user
   */
  async getAIPathways(userId: string): Promise<AIPathwayRow[]> {
    try {
      const response = await tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userPathways,
        queries: [
          Query.equal("userId", userId),
          Query.equal("category", ["AI Recommended", "Custom Skill"]),
        ],
      });

      return response.rows as unknown as AIPathwayRow[];
    } catch (error) {
      console.error("Error fetching AI pathways:", error);
      return [];
    }
  },

  /**
   * Get a specific AI pathway by pathwayId
   */
  async getAIPathwayById(
    userId: string,
    pathwayId: string
  ): Promise<GeneratedPathwayResponse | null> {
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

      const row = response.rows[0] as any;

      // Reconstruct GeneratedPathwayResponse from stored data
      // Parse each array element back to objects
      const steps = row.stepsData
        ? row.stepsData.map((stepStr: string) => JSON.parse(stepStr))
        : [];

      const resources = row.resourcesData
        ? row.resourcesData.map((resourceStr: string) => JSON.parse(resourceStr))
        : [];

      return {
        pathway_title: row.name,
        description: row.description || "",
        steps,
        resources,
        estimatedDuration: row.estimatedTime || "",
      };
    } catch (error) {
      console.error("Error fetching AI pathway:", error);
      return null;
    }
  },

  /**
   * Update AI pathway completion status
   */
  async updateCompletion(
    rowId: string,
    completed: boolean
  ): Promise<AIPathwayRow> {
    const response = await tablesDB.updateRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userPathways,
      rowId,
      data: {
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      },
    });

    return response as unknown as AIPathwayRow;
  },

  /**
   * Delete an AI pathway
   */
  async delete(rowId: string): Promise<void> {
    await tablesDB.deleteRow({
      databaseId: DB_CONFIG.databaseId,
      tableId: DB_CONFIG.tables.userPathways,
      rowId,
    });
  },

  /**
   * Check if pathway already exists
   */
  async exists(userId: string, pathwayTitle: string): Promise<boolean> {
    try {
      const response = await tablesDB.listRows({
        databaseId: DB_CONFIG.databaseId,
        tableId: DB_CONFIG.tables.userPathways,
        queries: [
          Query.equal("userId", userId),
          Query.equal("name", pathwayTitle),
        ],
      });

      return response.total > 0;
    } catch (error) {
      console.error("Error checking pathway existence:", error);
      return false;
    }
  },
};
