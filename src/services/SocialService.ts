import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { Post } from '../models/social/feed/Post';
import { ServiceResponse } from '../api/ServiceResponse';

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
   */
  async getPosts(page: number, params: { limit?: number, postId?: number, category?: string, categoryDetail?: string | number } = {}): Promise<ServiceResponse<Post[] | Post | null>> {
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

      this.logger.debug?.(`[SocialService] Fetching posts: page=${page}, endpoint=/sosyal/liste/${page}/`);
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/sosyal/liste/${page}/`), formData);
      
      if (response && response.durum != null && Number(response.durum) === 1) {
        if (Array.isArray(response.icerik)) {
          const posts = response.icerik.map((p: any) => Post.fromJSON(p));
          return this.createSuccess(posts, response.aciklama);
        } else if (response.icerik && typeof response.icerik === 'object') {
          const post = Post.fromJSON(response.icerik);
          return this.createSuccess(post, response.aciklama);
        }
      }

      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Fetching posts failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Creates a new social post (Legacy).
   */
  async createPost(content: string, mediaIds?: number[]): Promise<ServiceResponse<any>> {
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
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Creating post failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Deletes a social post (Legacy).
   */
  async deletePost(postId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/sil/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Deleting post ${postId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of users who liked a specific post or comment (Legacy).
   */
  async getLikers(params: { postId?: number | string, commentId?: number | string }): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (params.postId !== undefined) {
        formData.append('postID', params.postId.toString());
      }
      if (params.commentId !== undefined) {
        formData.append('yorumID', params.commentId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begenenler/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Fetching likers failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Specific alias for fetching likers of a post.
   */
  async getPostLikers(postId: number | string): Promise<ServiceResponse<any>> {
    return this.getLikers({ postId });
  }

  /**
   * Removes a like from a post or comment (Legacy).
   */
  async removeLike(params: { postId: number | string, commentId?: number | string, category?: string }): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('yorumID', params.commentId?.toString() || '');
      formData.append('kategori', params.category || 'post');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begeni-sil/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Removing like failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Adds a like to a post or comment (Legacy).
   */
  async addLike(params: { postId: number | string, category?: string }): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('kategori', params.category || 'post');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begen/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Adding like failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches comments for a specific post (Legacy).
   */
  async getComments(postId: number | string): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorumlar/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Fetching comments for ${postId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches specific social notifications (Legacy).
   */
  async getSocialNotifications(params: { postId: number | string, category?: string }): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('bildirikategori', params.category || '');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/bildirim/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Fetching social notifications failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Creates a new comment on a post (Legacy).
   */
  async createComment(params: { postId: number | string, content: string, category?: string, replyTo?: number | string }): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('yorumicerik', params.content);
      formData.append('kategori', params.category || 'sosyal');
      formData.append('kimeyanit', params.replyTo?.toString() || '0');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorum-olustur/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Creating comment failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Deletes a comment (Legacy).
   */
  async deleteComment(commentId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();

    try {
      const formData = new FormData();
      formData.append('yorumID', commentId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorum-sil/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Deleting comment ${commentId} failed:`, error);
      return this.createError(error.message);
    }
  }
}
