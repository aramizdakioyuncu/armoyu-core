import { User } from '../models/auth/User';
export declare class UserService {
    /**
     * Search for users based on a query string.
     */
    static search(query: string): Promise<User[]>;
    /**
     * Get a specific user's public profile.
     */
    static getProfile(username: string): Promise<User | null>;
    /**
     * Follow or unfollow a user.
     */
    static toggleFollow(userId: string): Promise<boolean>;
    /**
     * Get a user's friends list.
     */
    static getFriends(userId: string): Promise<User[]>;
    /**
     * Update the current user's profile information.
     */
    static updateProfile(data: Partial<User>): Promise<User | null>;
}
