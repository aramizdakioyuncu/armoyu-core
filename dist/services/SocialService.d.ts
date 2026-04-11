import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Post } from '../models/social/Post';
/**
 * Service for managing social interactions, posts, feed, likes, and comments.
 * @checked 2026-04-12
 */
export declare class SocialService extends BaseService {
    constructor(client: ApiClient, logger: ArmoyuLogger);
    /**
     * Fetches posts from the social feed or a specific post by ID (Legacy).
     *
     * @param params Query parameters (postId, category, categoryDetail)
     * @returns List of posts or a single post
     */
    getPosts(params?: {
        postId?: number;
        category?: string;
        categoryDetail?: string | number;
    }): Promise<Post[] | Post | null>;
    /**
     * Creates a new social post (Legacy).
     *
     * @param content The text content of the post
     * @param mediaIds Optional array of media IDs associated with the post
     */
    createPost(content: string, mediaIds?: number[]): Promise<any>;
    /**
     * Deletes a social post (Legacy).
     *
     * @param postId The ID of the post to delete
     */
    deletePost(postId: number | string): Promise<any>;
    /**
     * Fetches the list of users who liked a specific post or comment (Legacy).
     *
     * @param params Identification parameters (postId or commentId)
     */
    getLikers(params: {
        postId?: number | string;
        commentId?: number | string;
    }): Promise<any>;
    /**
     * Removes a like from a post or comment (Legacy).
     *
     * @param params Query parameters (postId, commentId, category)
     */
    removeLike(params: {
        postId: number | string;
        commentId?: number | string;
        category?: string;
    }): Promise<any>;
    /**
     * Adds a like to a post or comment (Legacy).
     *
     * @param params Query parameters (postId, category)
     */
    addLike(params: {
        postId: number | string;
        category?: string;
    }): Promise<any>;
    /**
     * Fetches comments for a specific post (Legacy).
     *
     * @param postId The ID of the post
     */
    getComments(postId: number | string): Promise<any>;
    /**
     * Fetches specific social notifications (Legacy).
     *
     * @param params Query parameters (postId, category)
     */
    getSocialNotifications(params: {
        postId: number | string;
        category?: string;
    }): Promise<any>;
    /**
     * Creates a new comment on a post (Legacy).
     *
     * @param params Comment parameters (postId, content, category, replyTo)
     */
    createComment(params: {
        postId: number | string;
        content: string;
        category?: string;
        replyTo?: number | string;
    }): Promise<any>;
    /**
     * Deletes a comment (Legacy).
     *
     * @param commentId The ID of the comment to delete
     */
    deleteComment(commentId: number | string): Promise<any>;
}
