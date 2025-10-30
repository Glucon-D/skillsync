/**
 * @file api/follow/route.ts
 * @description API route for follow/unfollow functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { tablesDB, Query } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { currentUserId, targetUserId, action } = await request.json();

    if (!currentUserId || !targetUserId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Get current user profile
    const currentUserDocs = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTIONS.USERPROFILES,
      queries: [Query.equal('userId', currentUserId)],
    });

    if (currentUserDocs.rows.length === 0) {
      return NextResponse.json(
        { error: 'Current user profile not found' },
        { status: 404 }
      );
    }

    // Get target user profile
    const targetUserDocs = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTIONS.USERPROFILES,
      queries: [Query.equal('userId', targetUserId)],
    });

    if (targetUserDocs.rows.length === 0) {
      return NextResponse.json(
        { error: 'Target user profile not found' },
        { status: 404 }
      );
    }

    const currentUserDoc = currentUserDocs.rows[0];
    const targetUserDoc = targetUserDocs.rows[0];

    // Parse JSON strings to arrays
    let currentFollowingList: string[] = [];
    let targetFollowersList: string[] = [];

    try {
      currentFollowingList = currentUserDoc.followingList 
        ? JSON.parse(currentUserDoc.followingList) 
        : [];
    } catch (e) {
      currentFollowingList = [];
    }

    try {
      targetFollowersList = targetUserDoc.followersList 
        ? JSON.parse(targetUserDoc.followersList) 
        : [];
    } catch (e) {
      targetFollowersList = [];
    }

    if (action === 'follow') {
      // Add to following list if not already following
      if (!currentFollowingList.includes(targetUserId)) {
        currentFollowingList.push(targetUserId);
      }
      
      // Add to followers list if not already a follower
      if (!targetFollowersList.includes(currentUserId)) {
        targetFollowersList.push(currentUserId);
      }

      // Update current user (add to following list)
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USERPROFILES,
        rowId: currentUserDoc.$id,
        data: {
          followingList: JSON.stringify(currentFollowingList),
          followingCount: currentFollowingList.length,
        },
      });

      // Update target user (add to followers list)
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USERPROFILES,
        rowId: targetUserDoc.$id,
        data: {
          followersList: JSON.stringify(targetFollowersList),
          followersCount: targetFollowersList.length,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully followed user',
        followersCount: targetFollowersList.length,
        followingCount: currentFollowingList.length,
      });

    } else if (action === 'unfollow') {
      // Remove from following list
      const updatedFollowingList = currentFollowingList.filter(
        (id: string) => id !== targetUserId
      );
      
      // Remove from followers list
      const updatedFollowersList = targetFollowersList.filter(
        (id: string) => id !== currentUserId
      );

      // Update current user (remove from following list)
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USERPROFILES,
        rowId: currentUserDoc.$id,
        data: {
          followingList: JSON.stringify(updatedFollowingList),
          followingCount: updatedFollowingList.length,
        },
      });

      // Update target user (remove from followers list)
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTIONS.USERPROFILES,
        rowId: targetUserDoc.$id,
        data: {
          followersList: JSON.stringify(updatedFollowersList),
          followersCount: updatedFollowersList.length,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully unfollowed user',
        followersCount: updatedFollowersList.length,
        followingCount: updatedFollowingList.length,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error in follow/unfollow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process follow/unfollow request' },
      { status: 500 }
    );
  }
}
