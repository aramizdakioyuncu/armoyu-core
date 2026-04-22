import { PostResponse, PostCommentResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PostMapper } from '../utils/mappers';

/**
 * Service for social networking features including posts, comments, and likes.
 * Uses specialized mappers for Feed and Comments.
 */
export class SocialService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get the social feed for the current user.
   */
  async getPosts(page: number = 1, limit: number = 20, options?: { postId?: number, userId?: number, username?: string, filter?: string }): Promise<ServiceResponse<PostResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('limit', limit.toString());
      if (options?.postId) formData.append('postID', options.postId.toString());
      if (options?.userId) formData.append('oyuncubakid', options.userId.toString());
      if (options?.username) formData.append('oyuncubakusername', options.username);
      if (options?.filter) formData.append('paylasimozellik', options.filter);

      const response = await this.client.post<any>(`/0/0/sosyal/liste/${page}/`, formData);
      const data = this.handle<any>(response);
      
      const rawList = Array.isArray(data) ? data : [];
      const mapped = PostMapper.mapFeedList(rawList);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SocialService] Failed to fetch feed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get a specific social post by ID.
   */
  async getPost(postId: number): Promise<ServiceResponse<PostResponse | null>> {
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/liste/0/', formData);
      const data = this.handle<any>(response);
      
      const rawList = Array.isArray(data) ? data : [];
      const mapped = PostMapper.mapFeedList(rawList);
      
      return this.createSuccess(mapped.length > 0 ? mapped[0] : null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to fetch post ${postId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get a specific social post by a comment ID.
   */
  async getPostByComment(commentId: number): Promise<ServiceResponse<PostResponse | null>> {
    try {
      const formData = new FormData();
      formData.append('category', 'yorum');
      formData.append('categorydetail', commentId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/liste/0/', formData);
      const data = this.handle<any>(response);
      
      const rawList = Array.isArray(data) ? data : [];
      const mapped = PostMapper.mapFeedList(rawList);
      
      return this.createSuccess(mapped.length > 0 ? mapped[0] : null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to fetch post by comment ${commentId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get comments for a specific post.
   */
  async getComments(postId: number): Promise<ServiceResponse<PostCommentResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/yorumlar/0/', formData);
      const data = this.handle<any>(response);
      const mapped = PostMapper.mapCommentList(Array.isArray(data) ? data : []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to fetch comments for post ${postId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Share a new status or post.
   */
  async createPost(content: string, mediaIds?: number[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sosyalicerik', content);
      if (mediaIds && mediaIds.length > 0) {
        mediaIds.forEach(id => {
          formData.append('paylasimfoto[]', id.toString());
        });
      }

      const response = await this.client.post<any>('/0/0/sosyal/olustur/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SocialService] Post creation failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a social post.
   */
  async deletePost(postId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to delete post ${postId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get users who liked a specific post or comment.
   */
  async getLikers(id: number, type: 'post' | 'comment' = 'post'): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      if (type === 'post') {
        formData.append('postID', id.toString());
      } else {
        formData.append('yorumID', id.toString());
      }

      const response = await this.client.post<any>('/0/0/sosyal/begenenler/0/', formData);
      const data = this.handle<any>(response);
      const mapped = PostMapper.mapLikersList(Array.isArray(data) ? data : []);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to fetch likers for ${type} ${id}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Toggle like for a post or comment (Automatic toggle endpoint).
   */
  async like(id: number, category: 'post' | 'postyorum' = 'post'): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', id.toString());
      formData.append('kategori', category);

      const response = await this.client.post<any>('/0/0/sosyal/begen/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to like ${category} ${id}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Add a like to a post or comment.
   */
  async addLike(postId: number, commentId?: number, category: 'post' | 'comment' = 'post'): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());
      formData.append('yorumID', commentId?.toString() || '');
      formData.append('kategori', category);

      const response = await this.client.post<any>('/0/0/sosyal/begeni-ekle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to add like for ${category} ${commentId || postId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Remove a like from a post or comment.
   */
  async removeLike(postId: number, commentId?: number, category: 'post' | 'comment' = 'post'): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());
      formData.append('yorumID', commentId?.toString() || '');
      formData.append('kategori', category);

      const response = await this.client.post<any>('/0/0/sosyal/begeni-sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to remove like for ${category} ${commentId || postId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Report a social post.
   */
  async reportPost(postId: number, category: string = ''): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());
      formData.append('bildirikategori', category);

      const response = await this.client.post<any>('/0/0/sosyal/bildirim/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to report post ${postId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Add a comment to a social post.
   */
  async createComment(postId: number, content: string, replyTo: number = 0, category: string = 'sosyal'): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());
      formData.append('kategori', category);
      formData.append('kimeyanit', replyTo.toString());
      formData.append('yorumicerik', content);

      const response = await this.client.post<any>('/0/0/sosyal/yorum-olustur/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to create comment for post ${postId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a comment from a social post.
   */
  async deleteComment(commentId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('yorumID', commentId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/yorum-sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialService] Failed to delete comment ${commentId}:`, error);
      return this.createError(error.message);
    }
  }
}

