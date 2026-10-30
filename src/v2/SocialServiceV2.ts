import { BaseService } from '../services/BaseService';
import { Post, PostCommentResponse, ServiceResponse } from '../models';
import { PostMapper } from '../utils/mappers/social/PostMapper';
import { GetPostsOptions } from '../v1/SocialServiceV1';

export class SocialServiceV2 extends BaseService {
  async getPosts(page: number = 1, limit: number = 20, options?: GetPostsOptions): Promise<ServiceResponse<Post[]>> {
    this.requireAuth();
    try {
      const userQuery = options?.userId ? `&userId=${options.userId}` : '';
      const response = await this.client.get<any>(`/v1/social?page=${page}&limit=${limit}${userQuery}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(PostMapper.mapFeedListV2(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SocialServiceV2] Failed to fetch posts:', error.message);
      return this.createError(error.message);
    }
  }

  async getPost(postId: number): Promise<ServiceResponse<Post | null>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/social/${postId}`);
      const data = this.handle<any>(response);
      return this.createSuccess(data ? PostMapper.mapFeedPostV2(data) : null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to fetch post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getPostByComment(_commentId: number): Promise<ServiceResponse<Post | null>> {
    return this.createError('getPostByComment is not supported in V2');
  }

  async getComments(postId: number): Promise<ServiceResponse<PostCommentResponse[]>> {
    try {
      const response = await this.client.get<any>(`/v1/social/${postId}/comments`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(PostMapper.mapCommentListV2(data || []) as PostCommentResponse[], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to fetch comments of ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async createPost(content: string, mediaIds?: number[], location?: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const body: any = {
        content,
        type: 'post',
        images: mediaIds && mediaIds.length > 0 ? mediaIds : ''
      };
      if (location) body.location = location;

      const response = await this.client.post<any>('/v1/social', body);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SocialServiceV2] Post creation failed:', error.message);
      return this.createError(error.message);
    }
  }

  async updatePost(postId: number, content: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>('/v1/social', { post_id: postId, content });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to update post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async deletePost(postId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>('/v1/social', { post_id: postId });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to delete post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getLikers(id: number, _type: 'post' | 'comment' = 'post'): Promise<ServiceResponse<any[]>> {
    try {
      const response = await this.client.get<any>(`/v1/social/${id}/likes`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(PostMapper.mapLikersListV2(data || []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to fetch likers of ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async like(id: number, category: 'post' | 'postyorum' = 'post'): Promise<ServiceResponse<boolean>> {
    return this.addLike(id, undefined, category === 'post' ? 'post' : 'comment');
  }

  async addLike(postId: number, _commentId?: number, category: 'post' | 'comment' = 'post'): Promise<ServiceResponse<boolean>> {
    if (category === 'comment') return this.createError('Yorum beğenisi desteklenmiyor');
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/social/${postId}/like`, {});
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to like ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async removeLike(postId: number, _commentId?: number, category: 'post' | 'comment' = 'post'): Promise<ServiceResponse<boolean>> {
    if (category === 'comment') return this.createError('Yorum beğenisi desteklenmiyor');
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/social/${postId}/like`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to unlike ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async reportPost(_postId: number, _category: string = ''): Promise<ServiceResponse<boolean>> {
    return this.createError('reportPost is not supported in V2 yet');
  }

  async createComment(postId: number, content: string, replyTo: number = 0, _category: string = 'sosyal'): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/social/${postId}/comments`, { content, reply_to: replyTo || undefined });
      const data = this.handle<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to comment on ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async deleteComment(commentId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/social/comments/${commentId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to delete comment ${commentId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
