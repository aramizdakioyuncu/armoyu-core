import { User } from '../models/auth/User';
import { BaseService } from './BaseService';
export declare class UserService extends BaseService {
    constructor(client: any);
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
     * Get a user's friends list.
     */
    getFriends(userId: string): Promise<User[]>;
    /**
     * Update the current user's profile information.
     */
    updateProfile(data: Partial<User>): Promise<User | null>;
}
