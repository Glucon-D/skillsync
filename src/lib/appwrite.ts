/**
 * @file appwrite.ts
 * @description Appwrite client configuration for web SDK
 */

import { Client, Account, ID, OAuthProvider } from 'appwrite';

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error('Missing Appwrite environment variables');
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

// Initialize Account service
export const account = new Account(client);

// Export utilities
export { ID, OAuthProvider };
export default client;

