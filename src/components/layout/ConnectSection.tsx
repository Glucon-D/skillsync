/**
 * @file ConnectSection.tsx
 * @description Connect section showing list of users in the platform with search filter
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Loader2, Search } from 'lucide-react';
import { tablesDB } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants';
import type { Profile } from '@/lib/types';

export function ConnectSection() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        (user.username?.toLowerCase().includes(query)) ||
        (user.bio?.toLowerCase().includes(query))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USERPROFILES,
        queries: [],
      });
      
      const profiles = response.rows.map((doc: any) => ({
        ...doc,
        education: doc.education || [],
        skills: doc.skills || [],
        experience: doc.experience || [],
        socialLinks: doc.socialLinks || [],
        projects: doc.projects || [],
        documents: doc.documents || [],
        followersList: doc.followersList || "",
        followingList: doc.followingList || "",
      })) as Profile[];
      
      setUsers(profiles);
      setFilteredUsers(profiles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitial = (user: Profile) => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return '?';
  };

  if (isLoading) {
    return (
      <div className="px-3">
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Connect</span>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="px-3">
      <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
        <Users className="w-4 h-4" />
        <span>Connect</span>
      </div>
      
      {/* Search Filter */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-invisible">
        {filteredUsers.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-text-muted">
              {searchQuery ? 'No users found' : 'No users yet'}
            </p>
          </div>
        ) : (
          filteredUsers.slice(0, 10).map((user) => (
            <Link
              key={user.$id}
              href={`/${user.username || user.userId}`}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-background transition-colors group"
            >
              {user.userImage ? (
                <img
                  src={user.userImage}
                  alt={user.username || 'User'}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-border group-hover:border-primary-500 transition-colors"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-semibold text-sm shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {getUserInitial(user)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate group-hover:text-primary-500 transition-colors">
                  {user.username || 'Anonymous'}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
