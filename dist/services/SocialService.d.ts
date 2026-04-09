import { Post } from '../models/social/Post';
import { Notification } from '../models/social/Notification';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { SocketService } from './SocketService';
export declare class SocialService extends BaseService {
    private socket;
    constructor(client: ApiClient, logger: ArmoyuLogger, socket: SocketService);
    /**
     * Fetch the social feed (posts from follows/groups).
     */
    getFeed(page?: number): Promise<Post[]>;
    /**
     * Create a new post.
     */
    createPost(content: string, media?: any[]): Promise<Post | null>;
    /**
     * Like or unlike a post.
     */
    toggleLike(postId: string): Promise<boolean>;
    /**
     * Add a comment to a post.
     */
    addComment(postId: string, content: string): Promise<any>;
    /**
     * Get user notifications.
     */
    getNotifications(): Promise<Notification[]>;
    /**
     * Mark a notification as read.
     */
    markNotificationAsRead(notificationId: string): Promise<void>;
}
