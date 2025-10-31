/**
 * @file connect/page.tsx
 * @description Connect page showing all users with search and filter capabilities
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Loader2,
  Search,
  UserPlus,
  MapPin,
  Briefcase,
} from "lucide-react";
import { tablesDB } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/constants";
import type { Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ConnectPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.bio?.toLowerCase().includes(query) ||
          user.location?.toLowerCase().includes(query) ||
          user.skills?.some((skill) => skill.name.toLowerCase().includes(query))
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
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitial = (user: Profile) => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "?";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Loader2 className="w-20 h-20 text-primary-500 animate-spin" />
            <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">
            Loading users...
          </h3>
          <p className="text-text-muted">Discovering the community</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight">
              Connect
            </h1>
            <p className="text-sm text-text-muted max-w-2xl">
              Discover and connect with other learners in the community
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by username, bio, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-border bg-background focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "user" : "users"} found
          </span>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">
              {searchQuery ? "No users found" : "No users yet"}
            </h3>
            <p className="text-text-muted">
              {searchQuery
                ? "Try adjusting your search filters"
                : "Be the first to join the community!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Link
              key={user.$id}
              href={`/connect/${user.username || user.userId}`}
            >
              <Card className="h-full border-border hover:border-primary-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="pt-6">
                  {/* Avatar and Name */}
                  <div className="text-center mb-4">
                    {user.userImage ? (
                      <img
                        src={user.userImage}
                        alt={user.username || "User"}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-border group-hover:border-primary-500 transition-colors"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-3 text-primary-500 font-bold text-2xl group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {getUserInitial(user)}
                      </div>
                    )}
                    <h3 className="font-semibold text-text text-lg mb-1 group-hover:text-primary-500 transition-colors">
                      {user.username || "Anonymous"}
                    </h3>
                    {user.bio && (
                      <p className="text-sm text-text-muted line-clamp-2 mb-3">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-3 justify-center">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 mb-4 pb-4 border-b border-border">
                    <div className="text-center">
                      <div className="text-lg font-bold text-text">
                        {user.followersCount || 0}
                      </div>
                      <div className="text-xs text-text-muted">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-text">
                        {user.followingCount || 0}
                      </div>
                      <div className="text-xs text-text-muted">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-text">
                        {user.skills?.length || 0}
                      </div>
                      <div className="text-xs text-text-muted">Skills</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
