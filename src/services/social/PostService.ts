import { PostMapper } from '../../utils/mappers/PostMapper';
import { BaseService } from '../BaseService';
import { GetPostsResponse } from '../../models/social/GetPostsResponse';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles social post management (Feed, Create, Delete).
 */
export class PostService extends BaseService {
  async getPosts(page: number, params: any = {}): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const appendIfValue = (key: string, value: any) => {
        if (value === undefined || value === null || value === '') return;
        formData.append(key, value.toString());
      };

      appendIfValue('limit', params.limit);
      appendIfValue('postID', params.postId);
      appendIfValue('oyuncubakid', params.userId);
      appendIfValue('oyuncubakusername', params.username);
      appendIfValue('paylasimozellik', params.feature);

      // Deep debug for browser inspection
      console.log("[PostService] Final FormData entries:");
      formData.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      if (params.category && params.categoryDetail !== undefined && params.categoryDetail !== null && params.categoryDetail !== '') {
        // Exclusive mapping for player filtering
        if (params.category === 'oyuncu') {
          const detail = params.categoryDetail.toString();
          if (/^\d+$/.test(detail)) {
            appendIfValue('oyuncubakid', detail);
          } else {
            appendIfValue('oyuncubakusername', detail);
          }
        } else if (params.category === 'grup') {
          appendIfValue('grupid', params.categoryDetail);
        } else {
          // Standard mapping for other categories
          appendIfValue('category', params.category);
          appendIfValue('categorydetail', params.categoryDetail);
        }
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/sosyal/liste/${page}/`), formData);
      const icerik = this.handle(response);
      const mappedPosts = (Array.isArray(icerik) ? icerik : [icerik]).filter(Boolean).map(post => PostMapper.mapPost(post, this.usePreviousVersion));
      
      return this.createSuccess(mappedPosts, response?.aciklama || 'İşlem Başarılı');
    } catch (error: any) {
      return this.createError(error.message);
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
