import { PostMapper } from '../../utils/mappers/PostMapper';
import { BaseService } from '../BaseService';
import { GetPostsResponse } from '../../models/social/GetPostsResponse';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles social post management (Feed, Create, Delete).
 */
export class PostService extends BaseService {
  async getPosts(page: number, params: { limit?: number, postId?: number, category?: string, categoryDetail?: string | number } = {}): Promise<GetPostsResponse> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (params.limit !== undefined) formData.append('limit', params.limit.toString());
      if (params.postId !== undefined) formData.append('postID', params.postId.toString());
      if (params.category !== undefined) formData.append('category', params.category);
      if (params.categoryDetail !== undefined) formData.append('categorydetail', params.categoryDetail.toString());

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/sosyal/liste/${page}/`), formData);
      const icerik = this.handle<any>(response);
      const mappedPosts = (Array.isArray(icerik) ? icerik : [icerik]).filter(Boolean).map(post => PostMapper.mapPost(post, this.usePreviousVersion));

      return { icerik: mappedPosts, kod: Number(response.kod), durum: Number(response.durum), aciklama: response.aciklama || 'İşlem Başarılı' };
    } catch (error: any) {
      return { icerik: [], kod: 0, durum: 0, aciklama: error.message };
    }
  }

  async createPost(content: string, mediaIds?: number[]): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sosyalicerik', content);
      if (mediaIds) mediaIds.forEach(id => formData.append('paylasimfoto[]', id.toString()));
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/olustur/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async deletePost(postId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/sil/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
