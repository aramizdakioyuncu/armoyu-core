import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Post } from '../models/social/Post';

/**
 * Service for managing social interactions, posts, feed, likes, and comments.
 * @checked 2026-04-12
 */
export class SocialService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches posts from the social feed or a specific post by ID (Legacy).
   * 
   * @param page The page number (sayfa) - MANDATORY
   * @param params Additional query parameters (limit, postId, category, categoryDetail)
   * @returns List of posts or a single post
   */
  async getPosts(page: number, params: { limit?: number, postId?: number, category?: string, categoryDetail?: string | number } = {}): Promise<Post[] | Post | null> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      
      if (params.limit !== undefined) {
        formData.append('limit', params.limit.toString());
      }
      if (params.postId !== undefined) {
        formData.append('postID', params.postId.toString());
      }
      if (params.category !== undefined) {
        formData.append('category', params.category);
      }
      if (params.categoryDetail !== undefined) {
        formData.append('categorydetail', params.categoryDetail.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/liste/0/'), formData);
      
      if (response && response.durum != null && Number(response.durum) === 1) {
        if (Array.isArray(response.icerik)) {
          return response.icerik.map((p: any) => Post.fromJSON(p));
        } else if (response.icerik && typeof response.icerik === 'object') {
          return Post.fromJSON(response.icerik);
        }
      }

      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Fetching posts failed:`, error);
      return null;
    }
  }

  /**
   * Creates a new social post (Legacy).
   * 
   * @param content The text content of the post
   * @param mediaIds Optional array of media IDs associated with the post
   */
  async createPost(content: string, mediaIds?: number[]): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('sosyalicerik', content);
      
      if (mediaIds && mediaIds.length > 0) {
        mediaIds.forEach(id => {
          formData.append('paylasimfoto[]', id.toString());
        });
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/olustur/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Creating post failed:`, error);
      return null;
    }
  }

  /**
   * Deletes a social post (Legacy).
   * 
   * @param postId The ID of the post to delete
   */
  async deletePost(postId: number | string): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/sil/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Deleting post ${postId} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the list of users who liked a specific post or comment (Legacy).
   * 
   * @param params Identification parameters (postId or commentId)
   */
  async getLikers(params: { postId?: number | string, commentId?: number | string }): Promise<any> {
    try {
      const formData = new FormData();
      if (params.postId !== undefined) {
        formData.append('postID', params.postId.toString());
      }
      if (params.commentId !== undefined) {
        formData.append('yorumID', params.commentId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begenenler/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Fetching likers failed:`, error);
      return null;
    }
  }

  /**
   * Specific alias for fetching likers of a post.
   * 
   * @param postId The ID of the post
   */
  async getPostLikers(postId: number | string): Promise<any> {
    return this.getLikers({ postId });
  }

  /**
   * Removes a like from a post or comment (Legacy).
   * 
   * @param params Query parameters (postId, commentId, category)
   */
  async removeLike(params: { postId: number | string, commentId?: number | string, category?: string }): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('yorumID', params.commentId?.toString() || '');
      formData.append('kategori', params.category || 'post');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begeni-sil/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Removing like failed:`, error);
      return null;
    }
  }

  /**
   * Adds a like to a post or comment (Legacy).
   * 
   * @param params Query parameters (postId, category)
   */
  async addLike(params: { postId: number | string, category?: string }): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('kategori', params.category || 'post');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begen/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Adding like failed:`, error);
      return null;
    }
  }

  /**
   * Fetches comments for a specific post (Legacy).
   * 
   * @param postId The ID of the post
   */
  async getComments(postId: number | string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorumlar/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Fetching comments for ${postId} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches specific social notifications (Legacy).
   * 
   * @param params Query parameters (postId, category)
   */
  async getSocialNotifications(params: { postId: number | string, category?: string }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('bildirikategori', params.category || '');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/bildirim/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Fetching social notifications failed:`, error);
      return null;
    }
  }

  /**
   * Creates a new comment on a post (Legacy).
   * 
   * @param params Comment parameters (postId, content, category, replyTo)
   */
  async createComment(params: { postId: number | string, content: string, category?: string, replyTo?: number | string }): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('yorumicerik', params.content);
      formData.append('kategori', params.category || 'sosyal');
      formData.append('kimeyanit', params.replyTo?.toString() || '0');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorum-olustur/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Creating comment failed:`, error);
      return null;
    }
  }

  /**
   * Deletes a comment (Legacy).
   * 
   * @param commentId The ID of the comment to delete
   */
  async deleteComment(commentId: number | string): Promise<any> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('yorumID', commentId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorum-sil/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[SocialService] Deleting comment ${commentId} failed:`, error);
      return null;
    }
  }
}
