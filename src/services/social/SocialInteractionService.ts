import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles social interactions like likes, reporting, and social-specific notifications.
 */
export class SocialInteractionService extends BaseService {
  async getLikers(params: { postId?: number | string, commentId?: number | string }): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (params.postId !== undefined) formData.append('postID', params.postId.toString());
      if (params.commentId !== undefined) formData.append('yorumID', params.commentId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begenenler/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async addLike(params: { postId: number | string, category?: string }): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('kategori', params.category || 'post');
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begen/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async removeLike(params: { postId: number | string, commentId?: number | string, category?: string }): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('yorumID', params.commentId?.toString() || '');
      formData.append('kategori', params.category || 'post');
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/begeni-sil/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getSocialNotifications(params: { postId: number | string, category?: string }): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('bildirikategori', params.category || '');
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/bildirim/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama || 'İşlem Başarılı');
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
