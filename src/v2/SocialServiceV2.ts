import { BaseService } from '../services/BaseService';
import { Post, PostCommentResponse, ServiceResponse } from '../models';
import { PostMapper } from '../utils/mappers/social/PostMapper';
import { GetPostsOptions } from '../v1/SocialServiceV1';

export class SocialServiceV2 extends BaseService {
  async getPosts(page: number = 1, limit: number = 20, _options?: GetPostsOptions): Promise<ServiceResponse<Post[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/social?page=${page}&limit=${limit}`);
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

  async getComments(_postId: number): Promise<ServiceResponse<PostCommentResponse[]>> {
    return this.createError('getComments is not supported in V2 yet');
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
      const response = await this.client.delete<any>('/v1/social', { postId });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV2] Failed to delete post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getLikers(_id: number, _type: 'post' | 'comment' = 'post'): Promise<ServiceResponse<any[]>> {
    return this.createError('getLikers is not supported in V2 yet');
  }

  async like(_id: number, _category: 'post' | 'postyorum' = 'post'): Promise<ServiceResponse<boolean>> {
    return this.createError('like is not supported in V2 yet');
  }

  async addLike(_postId: number, _commentId?: number, _category: 'post' | 'comment' = 'post'): Promise<ServiceResponse<boolean>> {
    return this.createError('addLike is not supported in V2 yet');
  }

  async removeLike(_postId: number, _commentId?: number, _category: 'post' | 'comment' = 'post'): Promise<ServiceResponse<boolean>> {
    return this.createError('removeLike is not supported in V2 yet');
  }

  async reportPost(_postId: number, _category: string = ''): Promise<ServiceResponse<boolean>> {
    return this.createError('reportPost is not supported in V2 yet');
  }

  async createComment(_postId: number, _content: string, _replyTo: number = 0, _category: string = 'sosyal'): Promise<ServiceResponse<boolean>> {
    return this.createError('createComment is not supported in V2 yet');
  }

  async deleteComment(_commentId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteComment is not supported in V2 yet');
  }
}
