import { BaseService } from '../services/BaseService';
import { Post, PostCommentResponse, ServiceResponse } from '../models';
import { PostMapper } from '../utils/mappers/social/PostMapper';

export interface GetPostsOptions {
  postId?: number;
  userId?: number;
  username?: string;
  filter?: string;
}

export class SocialServiceV1 extends BaseService {
  async getPosts(page: number = 1, limit: number = 20, options?: GetPostsOptions): Promise<ServiceResponse<Post[]>> {
    try {
      const formData = new FormData();
      formData.append('limit', limit.toString());
      if (options?.postId) formData.append('postID', options.postId.toString());
      if (options?.userId) formData.append('oyuncubakid', options.userId.toString());
      if (options?.username) formData.append('oyuncubakusername', options.username);
      if (options?.filter) formData.append('paylasimozellik', options.filter);

      const response = await this.client.post<any>(`/0/0/sosyal/liste/${page}/`, formData);
      const data = this.handle<any>(response);
      return this.createSuccess(PostMapper.mapFeedList(Array.isArray(data) ? data : []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SocialServiceV1] Failed to fetch posts:', error.message);
      return this.createError(error.message);
    }
  }

  async getPost(postId: number): Promise<ServiceResponse<Post | null>> {
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/liste/0/', formData);
      const data = this.handle<any>(response);
      const list = PostMapper.mapFeedList(Array.isArray(data) ? data : []);
      return this.createSuccess(list.length > 0 ? list[0] : null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV1] Failed to fetch post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getPostByComment(commentId: number): Promise<ServiceResponse<Post | null>> {
    try {
      const formData = new FormData();
      formData.append('category', 'yorum');
      formData.append('categorydetail', commentId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/liste/0/', formData);
      const data = this.handle<any>(response);
      const list = PostMapper.mapFeedList(Array.isArray(data) ? data : []);
      return this.createSuccess(list.length > 0 ? list[0] : null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV1] Failed to fetch post by comment ${commentId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getComments(postId: number): Promise<ServiceResponse<PostCommentResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/yorumlar/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(PostMapper.mapCommentList(Array.isArray(data) ? data : []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV1] Failed to fetch comments for post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async createPost(content: string, mediaIds?: (number | string)[], _location?: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sosyalicerik', content);
      if (mediaIds && mediaIds.length > 0) {
        mediaIds.forEach(id => formData.append('paylasimfoto[]', id.toString()));
      }

      const response = await this.client.post<any>('/0/0/sosyal/olustur/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[SocialServiceV1] Post creation failed:', error.message);
      return this.createError(error.message);
    }
  }

  async updatePost(_postId: number, _content: string): Promise<ServiceResponse<boolean>> {
    return this.createError('updatePost is not supported in V1');
  }

  async deletePost(postId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV1] Failed to delete post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getLikers(id: number, type: 'post' | 'comment' = 'post'): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      if (type === 'post') formData.append('postID', id.toString());
      else formData.append('yorumID', id.toString());

      const response = await this.client.post<any>('/0/0/sosyal/begenenler/0/', formData);
      const data = this.handle<any>(response);
      return this.createSuccess(PostMapper.mapLikersList(Array.isArray(data) ? data : []), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV1] Failed to fetch likers for ${type} ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

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
      this.logger.error(`[SocialServiceV1] Failed to like ${category} ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

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
      this.logger.error(`[SocialServiceV1] Failed to add like:`, error.message);
      return this.createError(error.message);
    }
  }

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
      this.logger.error(`[SocialServiceV1] Failed to remove like:`, error.message);
      return this.createError(error.message);
    }
  }

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
      this.logger.error(`[SocialServiceV1] Failed to report post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

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
      this.logger.error(`[SocialServiceV1] Failed to create comment for post ${postId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async deleteComment(commentId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('yorumID', commentId.toString());

      const response = await this.client.post<any>('/0/0/sosyal/yorum-sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[SocialServiceV1] Failed to delete comment ${commentId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
