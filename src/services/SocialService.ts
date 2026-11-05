import { Post, PostCommentResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { SocialServiceV1, GetPostsOptions } from '../v1/SocialServiceV1';
import { SocialServiceV2 } from '../v2/SocialServiceV2';

export class SocialService extends BaseService {
  private version: SocialServiceV1 | SocialServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new SocialServiceV1(client, logger)
      : new SocialServiceV2(client, logger);
  }

  async getPosts(page: number = 1, limit: number = 20, options?: GetPostsOptions): Promise<ServiceResponse<Post[]>> {
    return this.version.getPosts(page, limit, options);
  }

  async getPost(postId: number): Promise<ServiceResponse<Post | null>> {
    return this.version.getPost(postId);
  }

  async getPostByComment(commentId: number): Promise<ServiceResponse<Post | null>> {
    return this.version.getPostByComment(commentId);
  }

  async getComments(postId: number): Promise<ServiceResponse<PostCommentResponse[]>> {
    return this.version.getComments(postId);
  }

  async createPost(content: string, mediaIds?: (number | string)[], location?: string): Promise<ServiceResponse<boolean>> {
    return this.version.createPost(content, mediaIds, location);
  }

  async updatePost(postId: number, content: string): Promise<ServiceResponse<boolean>> {
    return this.version.updatePost(postId, content);
  }

  async deletePost(postId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deletePost(postId);
  }

  async getLikers(id: number, type: 'post' | 'comment' = 'post'): Promise<ServiceResponse<any[]>> {
    return this.version.getLikers(id, type);
  }

  async like(id: number, category: 'post' | 'postyorum' = 'post'): Promise<ServiceResponse<boolean>> {
    return this.version.like(id, category);
  }

  async addLike(postId: number, commentId?: number, category: 'post' | 'comment' = 'post'): Promise<ServiceResponse<boolean>> {
    return this.version.addLike(postId, commentId, category);
  }

  async removeLike(postId: number, commentId?: number, category: 'post' | 'comment' = 'post'): Promise<ServiceResponse<boolean>> {
    return this.version.removeLike(postId, commentId, category);
  }

  async reportPost(postId: number, category: string = ''): Promise<ServiceResponse<boolean>> {
    return this.version.reportPost(postId, category);
  }

  async createComment(postId: number, content: string, replyTo: number = 0, category: string = 'sosyal'): Promise<ServiceResponse<boolean>> {
    return this.version.createComment(postId, content, replyTo, category);
  }

  async deleteComment(commentId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteComment(commentId);
  }
}
