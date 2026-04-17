import { CommentMapper } from '../../utils/mappers/comment-mapper';
import { BaseService } from '../BaseService';
import { GetCommentsResponse } from '../../models/social/GetCommentsResponse';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles social comment management (Get, Create, Delete).
 */
export class CommentService extends BaseService {
  async getComments(postId: number | string): Promise<GetCommentsResponse> {
    try {
      const formData = new FormData();
      formData.append('postID', postId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorumlar/0/'), formData);
      const mappedComments = (this.handle<any[]>(response) || []).map((c: any) => CommentMapper.mapComment(c, this.usePreviousVersion));
      return { icerik: mappedComments, kod: Number(response.kod), durum: Number(response.durum), aciklama: response.aciklama || 'İşlem Başarılı' };
    } catch (error: any) {
      return { icerik: [], kod: 0, durum: 0, aciklama: error.message };
    }
  }

  async createComment(params: { postId: number | string, content: string, category?: string, replyTo?: number | string }): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('postID', params.postId.toString());
      formData.append('yorumicerik', params.content);
      formData.append('kategori', params.category || 'sosyal');
      formData.append('kimeyanit', params.replyTo?.toString() || '0');
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorum-olustur/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return { icerik: [], kod: 0, durum: 0, aciklama: error.message } as any;
    }
  }

  async deleteComment(commentId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('yorumID', commentId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/yorum-sil/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return { icerik: [], kod: 0, durum: 0, aciklama: error.message } as any;
    }
  }
}
