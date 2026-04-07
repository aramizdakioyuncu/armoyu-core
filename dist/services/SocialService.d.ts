import { Post } from '../models/social/Post';
import { Notification } from '../models/social/Notification';
export declare class SocialService {
    /**
     * Fetch the social feed (posts from follows/groups).
     */
    static getFeed(page?: number): Promise<Post[]>;
    /**
     * Create a new post.
     */
    static createPost(content: string, media?: any[]): Promise<Post | null>;
    /**
     * Like or unlike a post.
     */
    static toggleLike(postId: string): Promise<boolean>;
    /**
     * Add a comment to a post.
     */
    static addComment(postId: string, content: string): Promise<any>;
    /**
     * Get user notifications.
     */
    static getNotifications(): Promise<Notification[]>;
    /**
     * Mark a notification as read.
     */
    static markNotificationAsRead(notificationId: string): Promise<void>;
}
