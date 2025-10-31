/**
 * @file appwrite.ts
 * @description Appwrite client configuration for web SDK
 */

import { Client, Account, TablesDB, Storage } from 'appwrite';

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const tableUserProfiles = process.env.NEXT_PUBLIC_APPWRITE_TABLE_USERPROFILES;
const tableUserCourses = process.env.NEXT_PUBLIC_APPWRITE_TABLE_USER_COURSES;
const tableUserPathways = process.env.NEXT_PUBLIC_APPWRITE_TABLE_USER_PATHWAYS;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

if (!endpoint || !projectId) {
  throw new Error('Missing required Appwrite environment variables: endpoint or projectId');
}

if (!databaseId || !tableUserProfiles || !tableUserCourses || !tableUserPathways) {
  throw new Error('Missing required Appwrite database configuration variables');
}

if (!bucketId) {
  throw new Error('Missing required Appwrite bucket configuration');
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

// Initialize services
export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const databases = tablesDB; // Alias for consistency
export const storage = new Storage(client);

// Export database configuration
export const DB_CONFIG = {
  databaseId,
  bucketId,
  tables: {
    userProfiles: tableUserProfiles,
    userCourses: tableUserCourses,
    userPathways: tableUserPathways,
  },
} as const;

// Export utilities
export { ID, OAuthProvider, Query } from 'appwrite';
export default client;

