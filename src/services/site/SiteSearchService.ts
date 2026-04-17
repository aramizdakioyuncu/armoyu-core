import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles site-wide search and tag searches.
 */
export class SiteSearchService extends BaseService {
  async searchTags(page: number, params: { tag: string, limit?: number }): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('etiket', params.tag);
      formData.append('sayfa', page.toString());
      formData.append('limit', (params.limit || 50).toString());
      const res = await this.client.post<any>(this.resolveBotPath(`/0/0/etiketler/${page}/0/`), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async search(page: number, params: any): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('oyuncuadi', params.query);
      formData.append('kategori', params.category);
      formData.append('kategoridetay', params.subCategory || '1');
      formData.append('sayfa', page.toString());
      formData.append('limit', (params.limit || 50).toString());
      const res = await this.client.post<any>(this.resolveBotPath(`/0/0/arama/${page}/0/`), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
