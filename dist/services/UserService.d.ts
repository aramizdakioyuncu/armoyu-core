import { User } from '../models/auth/User';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { NotificationCategory, NotificationSubCategory } from '../models/social/NotificationEnums';
import { MediaCategory } from '../models/social/MediaEnums';
/**
 * Service for managing user profiles, relationships, media, and social rankings.
 * @checked 2026-04-12
 */
export declare class UserService extends BaseService {
    constructor(client: ApiClient, logger: ArmoyuLogger);
    /**
     * Search for users based on a query string.
     */
    search(query: string): Promise<User[]>;
    /**
     * Get a specific user's public profile using the bot API.
     */
    getUserByUsername(username: string): Promise<User | null>;
    /**
     * Get a specific user's public profile (Legacy API).
     */
    /**
     * Follow or unfollow a user.
     */
    toggleFollow(userId: string): Promise<boolean>;
    /**
     * Sends a friend request or adds a friend (Legacy).
     *
     * @param userId The ID of the player to add (oyuncubakid)
     */
    addFriend(userId: number): Promise<any>;
    /**
     * Removes a friend connection (Legacy).
     *
     * @param userId The ID of the player to remove (oyuncubakid)
     */
    removeFriend(userId: number): Promise<any>;
    /**
     * Responds to a friend request (Legacy).
     *
     * @param userId The ID of the requester (oyuncubakid)
     * @param response The response (1 for accept, 0 for decline)
     */
    respondToFriendRequest(userId: number, response: number): Promise<any>;
    /**
     * Get a user's friends list.
     */
    getFriends(userId: string): Promise<User[]>;
    /**
     * Update the current user's profile information.
     */
    updateProfile(data: Partial<User>): Promise<User | null>;
    /**
     * Updates the current user's private personal information (Legacy).
     *
     * @param data The private information data including password verification
     */
    updatePrivatePersonalInfo(data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        birthday?: string;
        phoneNumber?: string;
        countryID?: number;
        provinceID?: number;
        passwordControl: string;
    }): Promise<any>;
    /**
     * Fetches the educational history (schools) for a specific player (Legacy).
     *
     * @param userId Optional ID of the player (oyuncubakid)
     */
    getUserSchools(userId?: number): Promise<any>;
    /**
     * Fetches detailed information about a specific school (Legacy).
     *
     * @param schoolId The ID of the school (okulID)
     */
    getSchoolDetail(schoolId: number): Promise<any>;
    /**
     * Fetches the friends list for a specific player (Legacy).
     *
     * @param params Pagination and specific player ID
     */
    getFriendsList(params?: {
        userId?: number;
        page?: number;
        limit?: number;
    }): Promise<any>;
    /**
     * Fetches the invitations list for the current player (Legacy).
     *
     * @param page The page number (sayfa)
     */
    getInvitationsList(page?: number): Promise<any>;
    /**
     * Refreshes the user's invitation code (Legacy).
     */
    refreshInviteCode(): Promise<any>;
    /**
     * Requests an email verification URL for the user (Legacy).
     *
     * @param userId Optional ID of the player (userID)
     */
    requestEmailVerificationUrl(userId?: number): Promise<any>;
    /**
     * Pokes a friend (Legacy).
     *
     * @param userId The ID of the friend to poke (oyuncubakid)
     */
    pokeFriend(userId: number): Promise<any>;
    /**
     * Sets the user's favorite team (Legacy).
     *
     * @param teamId The ID of the team (favoritakimID)
     */
    setFavoriteTeam(teamId: number): Promise<any>;
    /**
     * Fetches the media (photos/videos) for a specific player (Legacy).
     *
     * @param params Filtering and pagination options
     */
    getUserMedia(params: {
        userId?: number;
        limit?: number;
        page?: number;
        category?: MediaCategory | string;
    }): Promise<any>;
    /**
     * Fetches the social profile details for a specific player (Legacy).
     *
     * @param userId Optional ID of the player (oyuncubakid)
     */
    getSocialProfile(userId?: number): Promise<any>;
    /**
     * Fetches the notifications for the current user (Legacy).
     */
    getNotifications(): Promise<any>;
    /**
     * Fetches the paginated notifications history for the current user (Legacy).
     *
     * @param page The page number (sayfa)
     * @param limit The number of items per page
     * @param category Optional category filter (kategori)
     * @param subCategory Optional sub-category filter (kategoridetay)
     */
    /**
     * Fetches the paginated notifications history for the current user (Legacy).
     *
     * @param page The page number (sayfa)
     * @param limit The number of items per page
     * @param category Optional category filter (kategori)
     * @param subCategory Optional sub-category filter (kategoridetay)
     */
    getNotificationsHistory(page?: number, limit?: number, category?: NotificationCategory | string, subCategory?: NotificationSubCategory | string): Promise<any>;
    /**
     * Updates the user's avatar (Legacy).
     *
     * @param image The image file to upload (File or Blob)
     */
    updateAvatar(image: File | Blob): Promise<any>;
    /**
     * Resets the user's avatar to default (Legacy).
     */
    resetAvatar(): Promise<any>;
    /**
     * Resets the user's profile banner to default (Legacy).
     */
    resetBanner(): Promise<any>;
    /**
     * Updates the user's profile background (Legacy).
     *
     * @param image The image file to upload (File or Blob)
     */
    /**
     * Updates the user's profile background (Legacy).
     *
     * @param image The image file to upload (File or Blob)
     */
    updateBackground(image: File | Blob): Promise<any>;
    /**
     * Rotates a photo by a specified degree (Legacy).
     *
     * @param photoId The ID of the photo to rotate
     * @param degree The rotation degree (e.g. -1 for clockwise, 90, 180, etc.)
     */
    /**
     * Rotates a photo by a specified degree (Legacy).
     *
     * @param photoId The ID of the photo to rotate
     * @param degree The rotation degree (e.g. -1 for clockwise, 90, 180, etc.)
     */
    rotateMedia(photoId: number, degree: number): Promise<any>;
    /**
     * Deletes a specific media item (Legacy).
     *
     * @param mediaId The ID of the media to delete
     */
    deleteMedia(mediaId: number): Promise<any>;
    /**
     * Uploads one or more media files (Legacy).
     *
     * @param files Array of File or Blob objects
     * @param category Optional category for the upload
     */
    /**
     * Uploads one or more media files (Legacy).
     *
     * @param files Array of File or Blob objects
     * @param category Optional category for the upload
     */
    uploadMedia(files: (File | Blob)[], category?: MediaCategory | string): Promise<any>;
    /**
     * Fetches the user's notification settings (Legacy).
     */
    getNotificationSettings(): Promise<any>;
    /**
     * Updates notification settings (Legacy).
     *
     * @param settings Record of settings (e.g. { paylasimbegeni: true })
     */
    updateNotificationSettings(settings: Record<string, boolean | number>): Promise<any>;
    /**
     * Fetches the platform-wide XP rankings (Legacy).
     *
     * @param page The page number (sayfa)
     */
    getXpRankings(page?: number): Promise<any>;
    /**
     * Fetches the platform-wide Popularity rankings (Legacy).
     *
     * @param page The page number (sayfa)
     */
    getPopRankings(page?: number): Promise<any>;
}
